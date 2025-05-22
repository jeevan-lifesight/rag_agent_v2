from dotenv import load_dotenv
import os
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from sentence_transformers import SentenceTransformer
from google.cloud import aiplatform
from google.oauth2 import service_account
import openai
import numpy as np
from config import EMBEDDING_MODEL, LLM_MODEL, K, VERTEX_PROJECT, VERTEX_LOCATION, VERTEX_SA_PATH, QDRANT_HOST, QDRANT_PORT, QDRANT_COLLECTION, LLM_PROVIDER
from config import LLM_TEMPERATURE, LLM_TOP_P, LLM_MAX_TOKENS
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:3000", "http://localhost:3001"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str
    context_chunks: List[str]

# Dynamic Qdrant collection selection for retrieval
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
if os.getenv("QDRANT_COLLECTION"):
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")
elif "gemini" in EMBEDDING_MODEL:
    QDRANT_COLLECTION = "lifesight_gemini"
elif "mini" in EMBEDDING_MODEL.lower():
    QDRANT_COLLECTION = "lifesight_miniLM"
else:
    QDRANT_COLLECTION = "lifesight_other"

def get_vertex_embedding(text: str) -> np.ndarray:
    credentials = service_account.Credentials.from_service_account_file(VERTEX_SA_PATH)
    aiplatform.init(project=VERTEX_PROJECT, location=VERTEX_LOCATION, credentials=credentials)
    endpoint = aiplatform.Endpoint(f"projects/{VERTEX_PROJECT}/locations/{VERTEX_LOCATION}/publishers/google/models/textembedding-gecko@001")
    response = endpoint.predict(instances=[{"content": text}])
    return np.array(response.predictions[0]["embeddings"])

def get_hf_embedding(model: str, text: str) -> np.ndarray:
    embedder = SentenceTransformer(model)
    return embedder.encode([text])[0]

def get_gemini_embedding(text: str) -> np.ndarray:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    response = genai.embed_content(
        model=EMBEDDING_MODEL,  # e.g., "models/gemini-embedding-001"
        content=text,
        task_type="retrieval_query"
    )
    return np.array(response["embedding"])

def get_embedding(text: str) -> np.ndarray:
    if EMBEDDING_MODEL.startswith("vertex-ai"):
        return get_vertex_embedding(text)
    elif "gemini" in EMBEDDING_MODEL:
        return get_gemini_embedding(text)
    else:
        return get_hf_embedding(EMBEDDING_MODEL, text)

def retrieve_chunks(query_vector: np.ndarray, k: int) -> List[dict]:
    client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
    results = client.search(
        collection_name=QDRANT_COLLECTION,
        query_vector=query_vector.tolist(),
        limit=k,
    )
    return [
        {
            "score": hit.score,
            "text": hit.payload.get("text"),
            "source": hit.payload.get("source"),
            "chunk_id": hit.payload.get("chunk_id"),
        }
        for hit in results
    ]

def build_prompt(question: str, doc_snippets: List[str]) -> str:
    doc_snippets_str = "\n".join([
        f'  <snippet index="{i+1}">\n  {text}\n  </snippet>' for i, text in enumerate(doc_snippets)
    ])
    prompt = f"""
<prompt_instructions>
You are an AI assistant expert in our product documentation. Your goal is to answer the user's query based *only* on the provided documentation snippets and the ongoing conversation context.
**Guardrails:**
- Base your answer *primarily* on the information within the <documentation_snippets>.
- Use the <conversation_history> (summary and recent messages) only for understanding the context of the user's query (e.g., resolving pronouns, understanding follow-up questions).
- If the documentation snippets do not contain the answer, clearly state that the information wasn't found in the provided documents. Do not invent information or use external knowledge.
- If the user's query is ambiguous or lacks context, ask for clarification.
- If the query is outside the scope of the documentation (e.g., harmful, unethical, requests personal opinions, unrelated topics), politely decline to answer.
- Keep your answers concise and directly related to the documentation.
- Format technical details like code snippets or parameter names clearly.
</prompt_instructions>
<documentation_snippets>
{doc_snippets_str}
</documentation_snippets>
<current_user_query>
{question}
</current_user_query>
"""
    return prompt

def call_openai(prompt: str) -> str:
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful assistant for marketing measurement documentation."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=LLM_MAX_TOKENS,
        temperature=LLM_TEMPERATURE,
        top_p=LLM_TOP_P,
    )
    return response.choices[0].message.content.strip()

def call_gemini(prompt: str) -> str:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(LLM_MODEL)  # e.g., "gemini-pro"
    response = model.generate_content(prompt, generation_config={
        "temperature": LLM_TEMPERATURE,
        "top_p": LLM_TOP_P,
        "max_output_tokens": LLM_MAX_TOKENS,
    })
    return response.text.strip()

@app.post("/api/ask", response_model=AskResponse)
def ask(request: AskRequest):
    query_vector = get_embedding(request.question)
    chunks = retrieve_chunks(query_vector, K)
    doc_snippets = [c["text"] for c in chunks if c["text"]]
    print(f"[DEBUG] Retrieved Chunks for query: {request.question}")
    for i, c in enumerate(doc_snippets):
        print(f"[DEBUG] Chunk {i+1}: {c[:300]}")
    prompt = build_prompt(request.question, doc_snippets)
    if LLM_PROVIDER == "gemini":
        answer = call_gemini(prompt)
    else:
        answer = call_openai(prompt)
    return AskResponse(answer=answer, context_chunks=doc_snippets)

# To run the backend on port 9001, use:
# uvicorn main:app --host 0.0.0.0 --port 9001 --reload 