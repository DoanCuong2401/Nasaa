from .ingestion import Ingestion
from .config import INGESTION_CONFIG

if INGESTION_CONFIG['run']:
    ingestion = Ingestion()
    ingestion.run()
    ingestion.close()
    del ingestion


from fastapi import FastAPI, Query
from .embedder import Embedder
from .sql_db import SqlDB
from .vector_strore import WeaviateVectorStore
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from bs4 import BeautifulSoup
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='backend')
embedder = Embedder()
db = SqlDB()
vectorstore = WeaviateVectorStore()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/categories')
def get_categories():
    categories = db.get_categories()
    return {
        'status': 'success',
        'data': categories
    }

@app.get('/categories/{category_id}/documents')
def get_documents(category_id: int):
    docs = db.get_documents_by_category(category_id=category_id)
    return {
        'status': 'success',
        'data': docs
    }

class SearchRequest(BaseModel):
    query: str
    limit: int

@app.post('/search')
def search_documents(body: SearchRequest):
    """Hybrid smart search: semantic + textual + keyword.

    - Vector similarity via Weaviate on title and summary embeddings
    - Textual fallback/expansion: ILIKE across title, summary, and keyword names
    - Merges, de-duplicates, preserves semantic ranking first, then textual
    """
    try:
        # 1) Semantic search
        query_vector = embedder.embed(body.query)
        vector_ids = vectorstore.similarity_search(
            query_vector=query_vector,
            k=body.limit
        )

        # 2) Textual search (expand coverage for related terms/keywords)
        textual_docs = db.search_documents_textual(body.query, limit=body.limit)
        textual_ids = [d.id for d in textual_docs]

        # 3) Merge and de-duplicate while keeping vector ranking priority
        seen = set()
        merged_ids = []
        for did in vector_ids:
            if did not in seen:
                merged_ids.append(did)
                seen.add(did)
        for did in textual_ids:
            if did not in seen:
                merged_ids.append(did)
                seen.add(did)

        # Enforce final limit while preserving order
        merged_ids = merged_ids[: body.limit]
        docs = db.get_documents_by_ids(merged_ids)
        # Preserve merged ranking order
        id_to_doc = {d.id: d for d in docs}
        ordered_docs = [id_to_doc[i] for i in merged_ids if i in id_to_doc]

        return {
            'status': 'success',
            'data': ordered_docs
        }
    except Exception as e:
        return {
            'status': 'error',
            'data': str(e)
        }
    
@app.get("/article_content")
def get_article_content(url: str = Query(...)):
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }
        res = requests.get(url, headers=headers, timeout=5)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        # Lấy main-content
        main_tag = soup.find("main", id="main-content")
        main_html = str(main_tag) if main_tag else "<p>No content found</p>"

        # Lấy style trong head
        styles = soup.find_all("style")
        style_text = "\n".join([s.get_text() for s in styles])

        # Lấy link CSS (chỉ lấy href)
        links = [l["href"] for l in soup.find_all("link", rel="stylesheet") if l.get("href")]

        return {
            "status": "success",
            "data": {
                "html": main_html,
                "style": style_text,
                "links": links
            }
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}