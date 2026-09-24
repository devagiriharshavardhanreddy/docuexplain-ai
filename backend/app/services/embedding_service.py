import numpy as np
from typing import List
import hashlib
import re
import math

class EmbeddingService:
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def _get_model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                from app.config import settings
                self._model = SentenceTransformer(settings.EMBEDDING_MODEL)
            except Exception as e:
                self._model = "fallback"
        return self._model

    def _fallback_embed(self, text: str, dim: int = 384) -> List[float]:
        """High-density semantic hashing vectorizer with subword and word ngrams."""
        vec = np.zeros(dim, dtype=np.float32)
        words = re.findall(r'\b\w+\b', text.lower())
        if not words:
            # Non-empty placeholder
            vec[0] = 1.0
            return vec.tolist()
        
        # Word-level features
        for i, word in enumerate(words):
            # Unigram hash
            h1 = int(hashlib.md5(f"w_{word}".encode()).hexdigest(), 16)
            idx1 = h1 % dim
            sign1 = 1.0 if (h1 // dim) % 2 == 0 else -1.0
            vec[idx1] += sign1 * 2.0

            # Sub-word char 3-grams
            if len(word) >= 3:
                for c in range(len(word) - 2):
                    tri = word[c:c+3]
                    ht = int(hashlib.md5(f"c_{tri}".encode()).hexdigest(), 16)
                    vec[ht % dim] += 0.8 * (1.0 if (ht // dim) % 2 == 0 else -1.0)

            # Bigram hash
            if i < len(words) - 1:
                bg = f"{word}_{words[i+1]}"
                h2 = int(hashlib.md5(f"bg_{bg}".encode()).hexdigest(), 16)
                idx2 = h2 % dim
                sign2 = 1.0 if (h2 // dim) % 2 == 0 else -1.0
                vec[idx2] += sign2 * 2.5

        # L2 Normalize
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def get_embedding(self, text: str) -> List[float]:
        model = self._get_model()
        if model != "fallback" and hasattr(model, "encode"):
            try:
                emb = model.encode(text, normalize_embeddings=True)
                return emb.tolist() if hasattr(emb, "tolist") else list(emb)
            except Exception:
                return self._fallback_embed(text)
        return self._fallback_embed(text)

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        model = self._get_model()
        if model != "fallback" and hasattr(model, "encode"):
            try:
                embs = model.encode(texts, normalize_embeddings=True)
                return [e.tolist() if hasattr(e, "tolist") else list(e) for e in embs]
            except Exception:
                return [self._fallback_embed(t) for t in texts]
        return [self._fallback_embed(t) for t in texts]

embedding_service = EmbeddingService()
