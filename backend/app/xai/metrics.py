import re
from typing import List, Dict, Any, Tuple

class XAIMetrics:
    @staticmethod
    def extract_key_terms(text: str) -> List[str]:
        # Filter stop words and keep salient technical/factual words
        stopwords = {
            'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'for', 'to',
            'of', 'with', 'by', 'from', 'as', 'what', 'who', 'how', 'when', 'where', 'why',
            'this', 'that', 'these', 'those', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should', 'would'
        }
        words = re.findall(r'\b[a-zA-Z0-9_\-]{3,}\b', text.lower())
        salient = [w for w in words if w not in stopwords]
        return list(dict.fromkeys(salient)) # deduplicate preserving order

    @staticmethod
    def calculate_coverage(query: str, retrieved_chunks: List[Dict[str, Any]]) -> Tuple[float, str]:
        q_terms = XAIMetrics.extract_key_terms(query)
        if not q_terms or not retrieved_chunks:
            return 0.0, "Low"
        
        all_chunk_text = " ".join([c["content"].lower() for c in retrieved_chunks])
        covered_count = sum(1 for term in q_terms if term in all_chunk_text)
        coverage_ratio = covered_count / len(q_terms)
        
        if coverage_ratio >= 0.75:
            level = "High"
        elif coverage_ratio >= 0.4:
            level = "Moderate"
        else:
            level = "Low"
            
        return round(coverage_ratio, 4), level

    @staticmethod
    def calculate_consistency(retrieved_chunks: List[Dict[str, Any]]) -> float:
        if not retrieved_chunks or len(retrieved_chunks) <= 1:
            return 1.0
        
        similarities = [c.get("similarity", 0.5) for c in retrieved_chunks]
        if not similarities:
            return 0.5
        
        # Standard deviation of similarities (lower std = higher consistency)
        mean_sim = sum(similarities) / len(similarities)
        variance = sum((s - mean_sim) ** 2 for s in similarities) / len(similarities)
        std_dev = variance ** 0.5
        
        consistency = max(0.0, min(1.0, 1.0 - (std_dev * 2.0)))
        return round(consistency, 4)

    @staticmethod
    def calculate_confidence(
        retrieved_chunks: List[Dict[str, Any]],
        coverage_ratio: float,
        consistency: float,
        answer_grounded: bool = True
    ) -> Tuple[float, str, str]:
        if not retrieved_chunks or not answer_grounded:
            return 0.20, "Low", "High"
        
        similarities = [c.get("similarity", 0.0) for c in retrieved_chunks]
        max_sim = max(similarities) if similarities else 0.0
        avg_sim = sum(similarities) / len(similarities) if similarities else 0.0
        
        # Calibrated formula: 45% max similarity, 25% avg similarity, 20% coverage, 10% consistency
        score = (0.45 * max_sim) + (0.25 * avg_sim) + (0.20 * coverage_ratio) + (0.10 * consistency)
        score = max(0.05, min(0.99, score))
        
        # Determine confidence level & hallucination risk
        if score >= 0.82:
            conf_level = "High"
            risk = "Very Low"
        elif score >= 0.60:
            conf_level = "Moderate"
            risk = "Low"
        elif score >= 0.40:
            conf_level = "Low"
            risk = "Medium"
        else:
            conf_level = "Low"
            risk = "High"
            
        return round(score, 4), conf_level, risk
