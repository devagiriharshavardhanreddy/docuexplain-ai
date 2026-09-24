# DocuExplain AI — AI Document Intelligence Platform with Explainable AI (XAI)

> **"Understand Your Documents. Trust Every Answer."**  
> *Final-Year Engineering & Research Capstone Project (2026)*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorStore-orange.svg?style=flat)](https://trychroma.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🌟 Executive Summary & Research Contribution

Standard Generative AI question-answering systems operate as opaque black boxes, prone to ungrounded hallucinations and non-verifiable claims. **DocuExplain AI** solves this critical problem by pioneering a verifiable **Explainable AI (XAI)** document intelligence layer.

### Core Formulation:
$$\mathbf{\text{AI Answer}} + \mathbf{\text{Evidence}} + \mathbf{\text{Source Attribution}} + \mathbf{\text{Confidence Metric}} + \mathbf{\text{Explainability Audit}}$$

Every response delivered by DocuExplain AI is accompanied by:
1. **Calibrated Confidence Score (%)**: Joint formulation of top-k vector cosine similarities and lexical claim coverage.
2. **Exact Verbatim Source Attribution**: Document name, page number, and chunk index.
3. **Passage Highlighting**: Direct visual navigation to the exact page and sentence in the original document.
4. **Transparent Explainability Audit**: Chunks analyzed, average relevance, agreement metrics, and hallucination risk mitigation.
5. **Strict Anti-Hallucination Fallback**: Refuses to extrapolate if evidence similarity falls below threshold ($\theta = 0.35$).

---

## 📐 System Architecture

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│ Document Upload │ ────> │  Text Extraction &   │ ────> │ Vector Embeddings      │
│ (PDF/DOCX/PPTX) │       │ Semantic Chunking    │       │ (ChromaDB + SBERT)     │
└─────────────────┘       └──────────────────────┘       └───────────┬────────────┘
                                                                     │
┌─────────────────┐       ┌──────────────────────┐                   ▼
│ User Question   │ ────> │ Context-Grounded LLM │ <─── [ Top-K Evidence Chunks ]
└─────────────────┘       │ Generation Engine    │
                          └──────────┬───────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │      Explainable AI (XAI)       │
                    │ • Confidence Score Matrix       │
                    │ • Exact Bounding/Passage Quotes │
                    │ • Relevance & Coverage Metrics  │
                    │ • Deep Attribution Audit        │
                    └────────────────┬────────────────┘
                                     ▼
                    ┌─────────────────────────────────┐
                    │ Modern SaaS UI (React 18 + Vite)│
                    │ • 3-Column Chat & XAI Panel     │
                    │ • Document Viewer & Highlighting│
                    │ • Semantic Search & Summarizer  │
                    │ • Recharts Analytics Dashboard  │
                    └─────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ / 20+

### Option 1: Automatic One-Click Launch (Windows)
Double-click `run_dev.bat` or run:
```cmd
.\run_dev.bat
```

### Option 2: Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API Documentation (Swagger UI):* `http://localhost:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend Web Application:* `http://localhost:5173`

---

## 🔑 Demo Credentials

Click the **"Instant One-Click Demo Access"** button on the Login page or use:
- **Email:** `researcher@docuexplain.ai`
- **Password:** `DemoUser2026!`

---

## 🧪 Testing & Verification

Run the automated backend test suite:
```bash
cd backend
.\venv\Scripts\pytest.exe -v tests
```

---

## 📂 Project Structure

```text
docuexplain-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entrypoint, CORS, router mounting
│   │   ├── database.py              # SQLite/PostgreSQL engine and session
│   │   ├── config.py                # Pydantic Settings
│   │   ├── models/                  # SQLAlchemy ORM (User, Document, Chunk, Message, etc.)
│   │   ├── schemas/                 # Pydantic Schemas for DTO validation
│   │   ├── auth/                    # JWT & Bcrypt Authentication
│   │   ├── services/                # Parsers (PDF/DOCX/PPTX), Chunker, ChromaDB, SBERT
│   │   ├── rag/                     # RAG Retriever & Grounded Generation Engine
│   │   ├── xai/                     # Explainable AI Metrics & Explainer
│   │   └── routers/                 # Auth, Documents, Chat, Search, Summarize, Analytics
│   ├── sample_docs/                 # Sample research documents for evaluation
│   ├── tests/                       # Pytest unit & integration test suite
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Buttons, Cards, Badges, Modals, XAIPanel, Dropzone
│   │   ├── context/                 # AuthContext, ToastContext
│   │   ├── services/                # Axios API clients
│   │   └── pages/                   # Landing, Dashboard, Documents, Chat, Search, Summaries, Analytics
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── run_dev.bat
└── README.md
```
