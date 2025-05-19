from dotenv import load_dotenv
load_dotenv()

import os
import tempfile
import shutil
from pathlib import Path
from typing import List
from git import Repo
from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import numpy as np
# Load embedding model from environment
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
# Dynamic Qdrant collection selection
if os.getenv("QDRANT_COLLECTION"):
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")
elif "gemini" in EMBEDDING_MODEL:
    QDRANT_COLLECTION = "lifesight_gemini"
elif "mini" in EMBEDDING_MODEL.lower():
    QDRANT_COLLECTION = "lifesight_miniLM"
else:
    QDRANT_COLLECTION = "lifesight_other"
from config import VERTEX_PROJECT, VERTEX_LOCATION, VERTEX_SA_PATH, QDRANT_HOST, QDRANT_PORT
from google.cloud import aiplatform
from google.oauth2 import service_account
import google.generativeai as genai
import time
from tqdm import tqdm

REPO_URL = "https://github.com/anupn18/readme_lifesight"
# Chunking parameters: configurable via environment variables
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 500))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 50))


def clone_or_update_repo(repo_url: str, dest: Path):
    if dest.exists():
        print(f"Updating repo at {dest}")
        repo = Repo(dest)
        repo.remotes.origin.pull()
    else:
        print(f"Cloning repo {repo_url} to {dest}")
        Repo.clone_from(repo_url, dest)


def get_markdown_files(data_dir: Path) -> List[Path]:
    md_files = []
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".md"):
                md_files.append(Path(root).joinpath(file))
    return md_files


def chunk_markdown_file(file_path: Path, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP) -> List[dict]:
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = splitter.split_text(text)
    return [{
        "text": chunk,
        "metadata": {
            "source": str(file_path),
            "chunk_id": i
        }
    } for i, chunk in enumerate(chunks)]


def get_vertex_embedding(texts: List[str]) -> List[np.ndarray]:
    aiplatform.init(project=VERTEX_PROJECT, location=VERTEX_LOCATION)
    model = aiplatform.TextEmbeddingModel.from_pretrained("textembedding-gecko@001")
    embeddings = []
    for text in texts:
        response = model.get_embeddings([text])
        embeddings.append(np.array(response[0].embedding))
    return embeddings


def get_hf_embedding(model: str, texts: List[str]) -> List[np.ndarray]:
    embedder = SentenceTransformer(model)
    return embedder.encode(texts)


def get_gemini_embedding(texts: list[str]) -> list[np.ndarray]:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    print("Using Gemini embedding model:", EMBEDDING_MODEL)
    embeddings = []
    embedding_size = 768  # Default size; update if your model uses a different size
    for text in tqdm(texts, desc="Embedding with Gemini"):
        for attempt in range(5):  # Try up to 5 times
            try:
                response = genai.embed_content(
                    model=EMBEDDING_MODEL,
                    content=text,
                    task_type="retrieval_document"
                )
                embeddings.append(np.array(response["embedding"]))
                break  # Success, break out of retry loop
            except Exception as e:
                print(f"Error: {e}. Retrying ({attempt+1}/5)...")
                time.sleep(2 ** attempt)  # Exponential backoff: 1s, 2s, 4s, 8s, 16s
        else:
            print(f"Failed to embed after 5 attempts. Skipping this chunk.")
            embeddings.append(np.zeros(embedding_size))  # Or set to None if you want to skip
        time.sleep(0.55)  # Throttle requests to avoid rate limiting
    return embeddings


def get_embeddings(texts: List[str]) -> List[np.ndarray]:
    if EMBEDDING_MODEL.startswith("vertex-ai"):
        return get_vertex_embedding(texts)
    elif "gemini" in EMBEDDING_MODEL:
        return get_gemini_embedding(texts)
    else:
        return get_hf_embedding(EMBEDDING_MODEL, texts)


def ingest():
    # 1. Clone or update repo
    with tempfile.TemporaryDirectory() as tmpdir:
        repo_dir = Path(tmpdir) / "readme_lifesight"
        clone_or_update_repo(REPO_URL, repo_dir)
        # Search for markdown files in the entire repo, not just docs/METHODOLOGIES
        md_files = get_markdown_files(repo_dir)
        print(f"Found {len(md_files)} markdown files in {repo_dir}")
        # 3. Chunk files
        all_chunks = []
        for md_file in md_files:
            all_chunks.extend(chunk_markdown_file(md_file))
        print(f"Total chunks to ingest: {len(all_chunks)}")
        # 4. Embed and upsert
        client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        # Create collection if not exists
        if QDRANT_COLLECTION not in [c.name for c in client.get_collections().collections]:
            # Use a sample embedding to get dimension
            sample_emb = get_embeddings([all_chunks[0]["text"]])[0]
            client.recreate_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=qdrant_models.VectorParams(size=len(sample_emb), distance=qdrant_models.Distance.COSINE)
            )
        point_id = 0
        for i in tqdm(range(0, len(all_chunks), 64), desc="Ingesting to Qdrant"):
            batch = all_chunks[i:i+64]
            texts = [item["text"] for item in batch]
            embeddings = get_embeddings(texts)
            payload = [item["metadata"] | {"text": item["text"]} for item in batch]
            client.upsert(
                collection_name=QDRANT_COLLECTION,
                points=[
                    qdrant_models.PointStruct(
                        id=point_id + j,
                        vector=emb.tolist(),
                        payload=pl
                    ) for j, (emb, pl) in enumerate(zip(embeddings, payload))
                ]
            )
            point_id += len(batch)
        print(f"Ingested {len(all_chunks)} chunks into Qdrant collection '{QDRANT_COLLECTION}'")

if __name__ == "__main__":
    ingest() 