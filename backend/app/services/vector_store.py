import chromadb
from typing import List, Dict, Any, Optional
from app.config import settings
from app.services.embedding_service import embedding_service

class VectorStoreService:
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStoreService, cls).__new__(cls)
            cls._instance._init_client()
        return cls._instance

    def _init_client(self):
        self._client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)

    def get_user_collection(self, user_id: int):
        collection_name = f"user_{user_id}_documents"
        # ChromaDB requires alphanumeric collection names with dashes/underscores
        return self._client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def add_document_chunks(
        self,
        user_id: int,
        document_id: int,
        document_name: str,
        chunks: List[Dict[str, Any]]
    ):
        if not chunks:
            return

        collection = self.get_user_collection(user_id)
        
        ids = []
        documents = []
        embeddings = []
        metadatas = []

        texts_to_embed = [c["clean_content"] for c in chunks]
        computed_embeddings = embedding_service.get_embeddings(texts_to_embed)

        for chunk, emb in zip(chunks, computed_embeddings):
            chunk_id = f"doc_{document_id}_chunk_{chunk['chunk_index']}"
            ids.append(chunk_id)
            documents.append(chunk["clean_content"])
            embeddings.append(emb)
            metadatas.append({
                "document_id": document_id,
                "document_name": document_name,
                "page_number": int(chunk["page_number"]),
                "chunk_index": int(chunk["chunk_index"]),
                "token_count": int(chunk.get("token_count", len(chunk["clean_content"].split())))
            })

        collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

    def search_similar(
        self,
        user_id: int,
        query: str,
        top_k: int = 5,
        document_ids: Optional[List[int]] = None
    ) -> List[Dict[str, Any]]:
        collection = self.get_user_collection(user_id)
        
        # Verify if collection has items
        if collection.count() == 0:
            return []

        query_embedding = embedding_service.get_embedding(query)
        
        where_filter = None
        if document_ids:
            if len(document_ids) == 1:
                where_filter = {"document_id": document_ids[0]}
            else:
                where_filter = {"document_id": {"$in": document_ids}}

        try:
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=min(top_k, collection.count()),
                where=where_filter,
                include=["documents", "metadatas", "distances"]
            )
        except Exception as e:
            print(f"[VectorStore] Query error: {e}")
            return []

        formatted_results = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metas = results["metadatas"][0] if "metadatas" in results else []
            distances = results["distances"][0] if "distances" in results else []

            for doc, meta, dist in zip(docs, metas, distances):
                # Cosine distance in Chroma is 1 - similarity.
                # Cosine similarity in [0, 1]
                similarity = max(0.0, min(1.0, 1.0 - float(dist))) if dist is not None else 0.5
                formatted_results.append({
                    "document_id": meta.get("document_id"),
                    "document_name": meta.get("document_name"),
                    "page_number": meta.get("page_number", 1),
                    "chunk_index": meta.get("chunk_index", 0),
                    "content": doc,
                    "similarity": round(similarity, 4)
                })

        # Sort descending by similarity
        formatted_results.sort(key=lambda x: x["similarity"], reverse=True)
        return formatted_results

    def delete_document(self, user_id: int, document_id: int):
        collection = self.get_user_collection(user_id)
        try:
            collection.delete(where={"document_id": document_id})
        except Exception as e:
            print(f"[VectorStore] Delete note: {e}")

vector_store = VectorStoreService()
