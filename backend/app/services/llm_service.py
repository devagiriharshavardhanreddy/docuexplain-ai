import os
import requests
import json
import re
from typing import List, Dict, Any, Optional
from app.config import settings

class LLMService:
    @staticmethod
    def _local_synthesize(query: str, retrieved_chunks: List[Dict[str, Any]]) -> str:
        """Grounded synthesis directly from retrieved document passages."""
        if not retrieved_chunks:
            return "I couldn't find sufficient evidence in the uploaded documents to answer this question."

        # Find the most relevant sentences across top chunks
        query_words = set(re.findall(r'\b[a-zA-Z0-9_\-]{3,}\b', query.lower()))
        salient_sentences = []

        for chunk in retrieved_chunks:
            text = chunk["content"]
            doc_name = chunk.get("document_name", "Document")
            page_num = chunk.get("page_number", 1)
            
            sentences = re.split(r'(?<=[.!?])\s+', text)
            for s in sentences:
                s_clean = s.strip()
                if len(s_clean) < 20:
                    continue
                s_words = set(re.findall(r'\b[a-zA-Z0-9_\-]{3,}\b', s_clean.lower()))
                overlap = len(query_words.intersection(s_words))
                if overlap > 0:
                    salient_sentences.append({
                        "sentence": s_clean,
                        "overlap": overlap,
                        "doc_name": doc_name,
                        "page_num": page_num,
                        "similarity": chunk.get("similarity", 0.5)
                    })

        # Sort by overlap and chunk similarity
        salient_sentences.sort(key=lambda x: (x["overlap"], x["similarity"]), reverse=True)

        if not salient_sentences:
            # Fallback to top chunk direct excerpt
            top_chunk = retrieved_chunks[0]
            first_sent = top_chunk["content"].split('\n')[0].strip()
            return f"Based on {top_chunk.get('document_name', 'the document')} (Page {top_chunk.get('page_number', 1)}): {first_sent}"

        # Deduplicate sentences
        chosen = []
        seen_texts = set()
        for item in salient_sentences[:4]:
            norm = item["sentence"].lower()[:50]
            if norm not in seen_texts:
                seen_texts.add(norm)
                chosen.append(item)

        # Formulate a cohesive answer
        primary = chosen[0]
        answer_parts = [
            f"Based on **{primary['doc_name']}** (*Page {primary['page_num']}*):\n\n"
            f"{primary['sentence']}"
        ]

        if len(chosen) > 1:
            additional_points = []
            for item in chosen[1:]:
                additional_points.append(f"- {item['sentence']} (*Source: {item['doc_name']} — Page {item['page_num']}*)")
            
            answer_parts.append("\n\n**Supporting Findings:**\n" + "\n".join(additional_points))

        return "\n".join(answer_parts)

    @classmethod
    def generate_answer(
        cls,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        system_prompt: Optional[str] = None
    ) -> str:
        # Check if OpenAI or Gemini API keys are configured
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
            try:
                import httpx
                context_str = "\n\n---\n\n".join([
                    f"Document: {c.get('document_name')}, Page: {c.get('page_number')}\nPassage: {c.get('content')}"
                    for c in retrieved_chunks
                ])
                prompt = f"""You are DocuExplain AI, an explainable document intelligence assistant.
Answer the user's question STRICTLY based on the provided document context below.
If the context does not contain enough information to answer the question, state:
"I couldn't find sufficient evidence in the uploaded documents to answer this question."
Do NOT extrapolate or fabricate facts. Always cite the document and page number in your response.

Context:
{context_str}

Question: {query}
"""
                resp = httpx.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.1
                    },
                    timeout=20.0
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[LLMService] OpenAI request error: {e}. Falling back to local engine.")

        # Default to local grounded synthesis
        return cls._local_synthesize(query, retrieved_chunks)

llm_service = LLMService()
