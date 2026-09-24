import sys
import os
import io

sys.path.insert(0, os.path.abspath("C:/Users/devag/.gemini/antigravity/scratch/docuexplain-ai/backend"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_e2e():
    print("=== [1/6] Testing Health Check ===")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("[OK] Health check passed:", r.json())

    print("\n=== [2/6] Testing User Registration & Login ===")
    user_email = "lead_researcher@docuexplain.ai"
    reg_payload = {
        "email": user_email,
        "full_name": "Dr. Aris Thorne",
        "password": "SecurePassword2026!"
    }
    r = client.post("/api/auth/register", json=reg_payload)
    if r.status_code != 200:
        r = client.post("/api/auth/login", json={"email": user_email, "password": "SecurePassword2026!"})
    
    assert r.status_code == 200, f"Auth failed: {r.text}"
    token_data = r.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Authenticated token obtained successfully.")

    print("\n=== [3/6] Testing Document Upload & 7-Stage Pipeline ===")
    sample_file_path = os.path.abspath("sample_docs/Project_Guidelines_AI_Defense.txt")
    with open(sample_file_path, "rb") as f:
        file_bytes = f.read()

    files = {"file": ("Project_Guidelines_AI_Defense.txt", io.BytesIO(file_bytes), "text/plain")}
    r = client.post("/api/documents/upload", headers=headers, files=files)
    assert r.status_code == 200, f"Document upload failed: {r.text}"
    doc_res = r.json()["document"]
    doc_id = doc_res["id"]
    print(f"[OK] Document indexed! ID={doc_id}, Status={doc_res['status']}, Chunks={doc_res['chunk_count']}, Pages={doc_res['page_count']}")

    print("\n=== [4/6] Testing Explainable AI (XAI) Chat Query ===")
    chat_payload = {
        "message": "What is the final project submission and demonstration deadline?",
        "document_ids": [doc_id],
        "include_xai": True
    }
    r = client.post("/api/chat", headers=headers, json=chat_payload)
    assert r.status_code == 200, f"Chat failed: {r.text}"
    chat_res = r.json()
    print("[OK] AI Answer Generated:")
    print("  ->", chat_res["answer"][:120], "...")
    print(f"  -> Confidence: {round(chat_res['confidence'] * 100, 1)}%")
    print(f"  -> Sources Cited: {len(chat_res['sources'])} sources")
    if chat_res.get("xai"):
        print("  -> XAI Explanation:", chat_res["xai"]["why_this_answer"])

    print("\n=== [5/6] Testing Semantic Vector Search ===")
    search_payload = {
        "query": "evaluation criteria weightage",
        "top_k": 3
    }
    r = client.post("/api/search", headers=headers, json=search_payload)
    assert r.status_code == 200, f"Search failed: {r.text}"
    search_res = r.json()
    print(f"[OK] Semantic Search returned {search_res['total_results']} matching passages:")
    for item in search_res["results"][:2]:
        print(f"  -> [{item['document_name']} p.{item['page_number']}] Relevance: {round(item['relevance_score']*100, 1)}%")

    print("\n=== [6/6] Testing Document Summarization & Analytics ===")
    summary_payload = {
        "document_id": doc_id,
        "summary_type": "executive"
    }
    r = client.post("/api/summarize", headers=headers, json=summary_payload)
    assert r.status_code == 200, f"Summarize failed: {r.text}"
    print("[OK] Executive summary successfully generated.")

    r = client.get("/api/analytics", headers=headers)
    assert r.status_code == 200, f"Analytics failed: {r.text}"
    analytics_data = r.json()
    print(f"[OK] Analytics Overview: {analytics_data['total_documents']} docs, {analytics_data['total_questions']} questions, Avg Conf: {analytics_data['average_confidence']}%")

    print("\n=======================================================")
    print(" ALL 6 END-TO-END VERIFICATION STAGES PASSED (100%)! ")
    print("=======================================================")

if __name__ == "__main__":
    run_e2e()
