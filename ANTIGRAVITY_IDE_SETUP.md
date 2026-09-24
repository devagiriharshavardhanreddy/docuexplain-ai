# Google Antigravity IDE Workspace Setup & Quickstart Guide

This guide describes how to configure, open, and run the **DocuExplain AI** platform within Google Antigravity IDE.

---

## 1. Setting the Active Workspace

The complete source code for DocuExplain AI is located at:
```
C:\Users\devag\.gemini\antigravity\scratch\docuexplain-ai
```

### To set this directory as your active workspace in Antigravity IDE:
1. Open **File** > **Open Workspace Directory...** (or press `Ctrl+K Ctrl+O`).
2. Select `C:\Users\devag\.gemini\antigravity\scratch\docuexplain-ai`.
3. The file explorer tree will load all backend, frontend, vector store, and documentation assets.

---

## 2. Directory Map in Antigravity IDE

```
docuexplain-ai/
├── backend/                         # FastAPI Python Backend
│   ├── app/                         # Core Application Logic
│   │   ├── auth/                    # JWT & Bcrypt Authentication
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   ├── rag/                     # Grounded Retrieval & Generation Engine
│   │   ├── routers/                 # REST API Endpoints (/auth, /documents, /chat, /search, /summarize, /analytics)
│   │   ├── schemas/                 # Pydantic DTOs
│   │   ├── services/                # Parsers (PPTX, PDF, DOCX, TXT), Chunker, ChromaDB, SBERT
│   │   ├── xai/                     # Explainable AI Metrics & Attribution Engine
│   │   ├── config.py                # Environment Configuration
│   │   ├── database.py              # SQLite/PostgreSQL Engine
│   │   └── main.py                  # FastAPI Entrypoint & CORS Middleware
│   ├── sample_docs/                 # Sample research documents & slide decks
│   ├── tests/                       # Pytest unit tests & e2e verification
│   └── requirements.txt
│
├── frontend/                        # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/              # Chat, Documents, XAI Panel, UI Cards, Modals
│   │   ├── context/                 # AuthContext & ToastContext
│   │   ├── pages/                   # Landing, Dashboard, Documents, Chat, Search, Summaries, Analytics
│   │   ├── services/                # Axios API Layer
│   │   └── index.css                # Cyber Design System & Glow Utilities
│   ├── package.json
│   └── vite.config.js
│
├── ANTIGRAVITY_IDE_SETUP.md         # This setup guide
├── ARCHITECTURE_SPECIFICATION.md    # System architecture & mathematical XAI formulation
├── API_DOCUMENTATION.md             # Complete REST API reference
├── SAMPLE_DATASETS_OVERVIEW.md      # Overview of sample files and recommended queries
├── docker-compose.yml               # Multi-container production deployment
└── run_dev.bat                      # Windows one-click start script
```

---

## 3. Running the Stack in Antigravity IDE

### Option A: One-Click Execution (Integrated Terminal)
Open the integrated terminal in Antigravity IDE (`Ctrl+`` `) and run:
```cmd
.\run_dev.bat
```

### Option B: Terminal Split (Manual Execution)

#### Terminal 1: FastAPI Backend
```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* **API Documentation (Swagger UI)**: `http://127.0.0.1:8000/docs`
* **Health Check**: `http://127.0.0.1:8000/api/health`

#### Terminal 2: React + Vite Frontend
```powershell
cd frontend
npm run dev
```
* **Web UI**: `http://localhost:5173`

---

## 4. One-Click Demo Credentials

* **URL**: `http://localhost:5173`
* **Click**: *"Explore Live Demo"* or *"Instant One-Click Demo Access"* on the login page.
* **Default Researcher Account**:
  * **Email**: `researcher@docuexplain.ai`
  * **Password**: `DemoUser2026!`

---

## 5. Running Automated Verification in Antigravity IDE

In the integrated terminal, execute the test suite:
```powershell
cd backend
.\venv\Scripts\pytest.exe -v tests
```
All 6 test suites (`test_password_hashing`, `test_jwt_token_flow`, `test_text_cleaner`, `test_chunker`, `test_xai_metrics`, `test_xai_fallback_on_empty`) will pass.
