import pytest
from app.auth.jwt_handler import get_password_hash, verify_password, create_access_token, decode_access_token
from app.services.doc_parser import DocumentParser
from app.services.text_cleaner import TextCleaner
from app.services.chunker import DocumentChunker
from app.xai.metrics import XAIMetrics
from app.xai.explainer import ExplainableAIEngine

def test_password_hashing():
    pwd = "SecurePassword123!"
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    user_id = 42
    token = create_access_token(user_id)
    decoded = decode_access_token(token)
    assert decoded == "42"

def test_text_cleaner():
    raw = "  Hello   world!\n\n\n\nThis is a test.  "
    clean = TextCleaner.clean(raw)
    assert clean == "Hello world!\n\nThis is a test."

def test_chunker():
    pages = [
        {"page_number": 1, "text": "Paragraph 1 about artificial intelligence. " * 10},
        {"page_number": 2, "text": "Paragraph 2 about explainable AI and machine learning. " * 10}
    ]
    chunks = DocumentChunker.chunk_document(pages, chunk_size=300, chunk_overlap=50)
    assert len(chunks) >= 2
    assert chunks[0]["page_number"] == 1
    assert chunks[-1]["page_number"] == 2

def test_xai_metrics():
    query = "What is the final project submission deadline?"
    chunks = [
        {
            "content": "The final project submission and demonstration deadline is August 15, 2026.",
            "similarity": 0.94,
            "document_name": "Guidelines.pdf",
            "page_number": 2,
            "document_id": 1,
            "chunk_index": 0
        },
        {
            "content": "Milestone 1 is due July 10, 2026. Viva Voce is on August 25, 2026.",
            "similarity": 0.82,
            "document_name": "Guidelines.pdf",
            "page_number": 2,
            "document_id": 1,
            "chunk_index": 1
        }
    ]
    coverage_ratio, cov_level = XAIMetrics.calculate_coverage(query, chunks)
    assert coverage_ratio > 0.5
    assert cov_level in ["High", "Moderate"]

    consistency = XAIMetrics.calculate_consistency(chunks)
    assert consistency > 0.5

    confidence, level, risk = XAIMetrics.calculate_confidence(chunks, coverage_ratio, consistency)
    assert confidence >= 0.75
    assert level in ["High", "Moderate"]
    assert risk in ["Very Low", "Low"]

def test_xai_fallback_on_empty():
    query = "What is the recipe for chocolate cake?"
    sources, xai = ExplainableAIEngine.build_citations_and_xai(query, [], "I couldn't find sufficient evidence.", is_fallback=True)
    assert xai.confidence_score < 0.30
    assert xai.confidence_level == "Low"
    assert xai.hallucination_risk == "High"
    assert len(sources) == 0
