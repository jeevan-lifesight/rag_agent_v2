# Lifesight RAG Agent

A Retrieval-Augmented Generation (RAG) system with a FastAPI backend and Next.js frontend. Supports multiple embedding models (Gemini, Vertex AI, HuggingFace/MiniLM), Qdrant vector storage, and developer-friendly configuration.

---

## Features
- **Configurable Embedding Models:** Gemini, Vertex AI, HuggingFace (MiniLM)
- **Qdrant Vector Store:** For fast, scalable retrieval
- **Markdown Ingestion:** Pulls docs from a GitHub repo
- **Chunking:** Configurable chunk size and overlap
- **Frontend:** Modern chat UI (Next.js)
- **Backend:** FastAPI, CORS enabled

---

## Quickstart

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd rag_agent_v2
```

### 2. Set Up Environment Variables
Create a `.env` file in `backend/` with the following (see below for details):
```ini
# Embedding/LLM
EMBEDDING_MODEL=all-MiniLM-L6-v2  # or models/gemini-embedding-001
LLM_MODEL=gpt-3.5-turbo           # or gemini-pro
LLM_PROVIDER=openai               # or gemini
GEMINI_API_KEY=your-gemini-key    # for Gemini
OPENAI_API_KEY=your-openai-key    # for OpenAI

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_COLLECTION=lifesight_miniLM  # or leave blank for auto-selection

# Chunking
CHUNK_SIZE=500
CHUNK_OVERLAP=100

# Vertex AI (if using Vertex)
VERTEX_PROJECT=your-gcp-project-id
VERTEX_LOCATION=us-central1
VERTEX_SA_PATH=path/to/vertex-service-account.json
```

### 3. Install Backend Dependencies
```bash
cd backend
python3 -m venv venv310
source venv310/bin/activate
pip install -r requirements.txt
```

### 4. Ingest Documentation
```bash
python ingest_to_qdrant.py
```
- This will pull markdown files from the configured GitHub repo, chunk them, embed, and upsert into Qdrant.
- The Qdrant collection is chosen based on the embedding model (or overridden by `QDRANT_COLLECTION`).

### 5. Run the Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 9001 --reload
```

### 6. Set Up and Run the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
- The frontend will be available at http://localhost:3000

---

## Environment Variables
| Variable                | Description                                                      | Example/Default                |
|-------------------------|------------------------------------------------------------------|-------------------------------|
| EMBEDDING_MODEL         | Embedding model to use (MiniLM, Gemini, Vertex)                  | all-MiniLM-L6-v2              |
| LLM_MODEL               | LLM for answering (OpenAI, Gemini)                               | gpt-3.5-turbo                 |
| LLM_PROVIDER            | LLM provider: 'openai' or 'gemini'                               | openai                        |
| GEMINI_API_KEY          | API key for Gemini models                                        | (your key)                    |
| OPENAI_API_KEY          | API key for OpenAI models                                        | (your key)                    |
| QDRANT_HOST             | Qdrant host                                                      | localhost                     |
| QDRANT_PORT             | Qdrant port                                                      | 6333                          |
| QDRANT_COLLECTION       | Qdrant collection name (auto-set by model if blank)              | lifesight_miniLM              |
| CHUNK_SIZE              | Chunk size for ingestion (characters)                            | 500                           |
| CHUNK_OVERLAP           | Overlap between chunks (characters)                              | 100                           |
| VERTEX_PROJECT          | GCP project for Vertex AI                                        | your-gcp-project-id           |
| VERTEX_LOCATION         | GCP location for Vertex AI                                       | us-central1                   |
| VERTEX_SA_PATH          | Path to Vertex AI service account JSON                           | path/to/vertex-sa.json        |

---

## Troubleshooting
- **Gemini 403 errors:** Only `gemini-pro` and `gemini-pro-vision` are available via API key. For other models, use a service account with correct permissions.
- **Chunks not retrieved:** Increase `RAG_K` or adjust `CHUNK_SIZE`/`CHUNK_OVERLAP`.
- **Frontend CORS errors:** Backend must be running with CORS enabled (already set up).
- **Qdrant connection issues:** Ensure Qdrant is running and accessible at the configured host/port.

---

## Advanced
- To use different embedding models, change `EMBEDDING_MODEL` and re-run ingestion.
- To use a different Qdrant collection, set `QDRANT_COLLECTION`.
- To debug retrieval, check backend logs for `[DEBUG] Retrieved Chunks...`.

---

## License
MIT 