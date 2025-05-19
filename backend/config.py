import os

# Embedding model: 'vertex-ai:text-embedding-004' or HuggingFace model name or Gemini model name
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")
print("CONFIG: EMBEDDING_MODEL =", EMBEDDING_MODEL)
# LLM model: e.g., 'gpt-3.5-turbo', 'gpt-4', etc.
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-3.5-turbo")
# LLM provider: 'openai' or 'gemini'
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
# Number of chunks to retrieve from Qdrant
K = int(os.getenv("RAG_K", 3))

# Vertex AI config
VERTEX_PROJECT = os.getenv("VERTEX_PROJECT", "your-gcp-project-id")
VERTEX_LOCATION = os.getenv("VERTEX_LOCATION", "us-central1")
VERTEX_SA_PATH = os.getenv("VERTEX_SA_PATH", "path/to/vertex-service-account.json")

# Qdrant config
QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
QDRANT_PORT = int(os.getenv("QDRANT_PORT", 6333))
QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "lifesight_marketing_measurements") 