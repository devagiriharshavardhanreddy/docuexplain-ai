from typing import List, Dict, Any, Tuple
import re
from app.xai.metrics import XAIMetrics
from app.schemas.chat import SourceCitation, XAIMetadata

class ExplainableAIEngine:
    @staticmethod
    def find_highlight_terms(query: str, evidence: str) -> List[str]:
        q_terms = XAIMetrics.extract_key_terms(query)
        evidence_words = re.findall(r'\b[a-zA-Z0-9_\-]{3,}\b', evidence.lower())
        matched = [term for term in q_terms if term in evidence_words]
        return list(dict.fromkeys(matched))

    @staticmethod
    def build_citations_and_xai(
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        answer: str,
        is_fallback: bool = False
    ) -> Tuple[List[SourceCitation], XAIMetadata]:
        if is_fallback or not retrieved_chunks:
            sources = []
            xai = XAIMetadata(
                confidence_score=0.18,
                confidence_level="Low",
                evidence_coverage="Low",
                chunks_analyzed=len(retrieved_chunks),
                average_relevance=0.0,
                max_relevance=0.0,
                evidence_consistency=0.0,
                hallucination_risk="High",
                why_this_answer=(
                    "No supporting evidence meeting the minimum similarity threshold was found in the indexed documents. "
                    "The system prevented hallucination by refusing to fabricate an answer."
                ),
                key_facts_found=[]
            )
            return sources, xai

        # Calculate metrics
        coverage_ratio, coverage_level = XAIMetrics.calculate_coverage(query, retrieved_chunks)
        consistency = XAIMetrics.calculate_consistency(retrieved_chunks)
        confidence_score, confidence_level, hallucination_risk = XAIMetrics.calculate_confidence(
            retrieved_chunks, coverage_ratio, consistency, answer_grounded=True
        )

        similarities = [c.get("similarity", 0.0) for c in retrieved_chunks]
        avg_rel = round(sum(similarities) / len(similarities), 4) if similarities else 0.0
        max_rel = round(max(similarities), 4) if similarities else 0.0

        # Construct citations
        sources = []
        key_facts = []
        pages_referenced = set()

        for chunk in retrieved_chunks[:4]: # top 4 citations
            evidence_text = chunk["content"].strip()
            highlights = ExplainableAIEngine.find_highlight_terms(query, evidence_text)
            
            # Extract first punchy sentence as a key fact
            first_sent = evidence_text.split('.')[0].strip()
            if len(first_sent) > 15 and first_sent not in key_facts:
                key_facts.append(first_sent)
                
            pages_referenced.add(chunk.get("page_number", 1))

            citation = SourceCitation(
                document_id=chunk["document_id"],
                document_name=chunk["document_name"],
                page_number=chunk.get("page_number", 1),
                chunk_index=chunk.get("chunk_index", 0),
                relevance_score=round(chunk.get("similarity", 0.0), 4),
                evidence_text=evidence_text,
                highlight_terms=highlights
            )
            sources.append(citation)

        pages_str = ", ".join([f"Page {p}" for p in sorted(pages_referenced)])
        why_explanation = (
            f"Answer synthesized from {len(retrieved_chunks)} relevant passage(s) across {pages_str}. "
            f"Top evidence relevance reached {int(max_rel * 100)}% with {coverage_level.lower()} evidence coverage "
            f"({int(coverage_ratio * 100)}%) and {int(consistency * 100)}% cross-chunk consistency. "
            f"Hallucination safeguard is {hallucination_risk}."
        )

        xai = XAIMetadata(
            confidence_score=confidence_score,
            confidence_level=confidence_level,
            evidence_coverage=coverage_level,
            chunks_analyzed=len(retrieved_chunks),
            average_relevance=avg_rel,
            max_relevance=max_rel,
            evidence_consistency=consistency,
            hallucination_risk=hallucination_risk,
            why_this_answer=why_explanation,
            key_facts_found=key_facts[:3]
        )

        return sources, xai

xai_engine = ExplainableAIEngine()
