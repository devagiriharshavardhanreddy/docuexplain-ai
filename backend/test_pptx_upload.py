import sys
import os
import io

sys.path.insert(0, os.path.abspath("C:/Users/devag/.gemini/antigravity/scratch/docuexplain-ai/backend"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Login
r = client.post("/api/auth/login", json={"email": "researcher@docuexplain.ai", "password": "DemoUser2026!"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Upload PPTX
sample_pptx = os.path.abspath("sample_docs/DocuExplain_AI_Defense_Slides.pptx")
with open(sample_pptx, "rb") as f:
    pptx_bytes = f.read()

files = {"file": ("DocuExplain_AI_Defense_Slides.pptx", io.BytesIO(pptx_bytes), "application/vnd.openxmlformats-officedocument.presentationml.presentation")}
r = client.post("/api/documents/upload", headers=headers, files=files)
print("Upload status:", r.status_code)
print("Response:", r.json())
