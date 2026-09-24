# DocuExplain AI — REST API Specification & Endpoint Reference

Base URL: `http://127.0.0.1:8000/api`  
Interactive Swagger UI: `http://127.0.0.1:8000/docs`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account and returns a JWT Bearer token.
* **Request Body (JSON):**
  ```json
  {
    "email": "researcher@university.edu",
    "full_name": "Dr. Elena Vance",
    "password": "SecurePassword2026!"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "researcher@university.edu",
      "full_name": "Dr. Elena Vance"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user via JSON payload or OAuth2 Form Data.
* **Request Body (JSON):**
  ```json
  {
    "email": "researcher@docuexplain.ai",
    "password": "DemoUser2026!"
  }
  ```

---

## 2. Document Management (`/api/documents`)

### `POST /api/documents/upload`
Uploads a document (PDF, PPTX, PPT, DOCX, TXT) and triggers the 7-stage XAI indexing pipeline.
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `multipart/form-data`
* **Form Field:** `file: <binary>`
* **Response (200 OK):**
  ```json
  {
    "message": "Document successfully processed and indexed with Explainable AI vectors.",
    "document": {
      "id": 3,
      "original_filename": "DocuExplain_AI_Defense_Slides.pptx",
      "file_type": "pptx",
      "file_size": 32624,
      "page_count": 5,
      "chunk_count": 5,
      "status": "ready"
    }
  }
  ```

### `GET /api/documents`
Lists all documents owned by the authenticated user.

### `GET /api/documents/{id}`
Retrieves document details with all indexed chunks and text content.

### `DELETE /api/documents/{id}`
Deletes the document, its chunks, and all associated ChromaDB vector embeddings.

---

## 3. Explainable AI Chat (`/api/chat`)

### `POST /api/chat`
Performs vector retrieval, grounded synthesis, and computes XAI confidence metrics.
* **Request Body (JSON):**
  ```json
  {
    "message": "What are the project submission and viva voce examination dates in the slides?",
    "document_ids": [3],
    "conversation_id": null,
    "include_xai": true
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "conversation_id": 1,
    "message_id": 2,
    "answer": "The final project submission deadline is August 15, 2026. The Viva Voce examination is scheduled for August 25, 2026.",
    "confidence": 0.942,
    "sources": [
      {
        "document_id": 3,
        "document_name": "DocuExplain_AI_Defense_Slides.pptx",
        "page_number": 3,
        "chunk_index": 2,
        "relevance_score": 0.952,
        "evidence_text": "• Final Project Submission Deadline: August 15, 2026.\n• Viva Voce Examination: August 25, 2026.",
        "highlight_terms": ["project", "submission", "deadline", "viva", "voce"]
      }
    ],
    "xai": {
      "confidence_score": 0.942,
      "confidence_level": "High",
      "evidence_coverage": "High",
      "chunks_analyzed": 5,
      "average_relevance": 0.891,
      "max_relevance": 0.952,
      "evidence_consistency": 0.910,
      "hallucination_risk": "Low",
      "why_this_answer": "Synthesized directly from Page 3 of DocuExplain_AI_Defense_Slides.pptx with 95% peak relevance and zero ungrounded extrapolation."
    }
  }
  ```

---

## 4. Semantic Search (`/api/search`)

### `POST /api/search`
* **Request Body (JSON):**
  ```json
  {
    "query": "cryptographic post-quantum migration timeline",
    "min_score": 0.25,
    "top_k": 8
  }
  ```

---

## 5. Multi-Mode Summarizer (`/api/summarize`)

### `POST /api/summarize`
* **Request Body (JSON):**
  ```json
  {
    "document_id": 3,
    "summary_type": "executive"
  }
  ```
* **Supported `summary_type` Modes:**
  1. `short`: Concise 2-3 sentence overview.
  2. `detailed`: Comprehensive multi-paragraph analysis.
  3. `executive`: High-level strategic briefing with key takeaways.
  4. `key_points`: Bullet-point breakdown of primary findings.
  5. `terms`: Important domain terms and concepts dictionary.
  6. `action_items`: Actionable steps, deadlines, and requirements.

---

## 6. Research Analytics (`/api/analytics`)

### `GET /api/analytics`
Returns aggregate statistics for confidence distribution histogram, 7-day query activity trends, document format breakdown, and high-confidence ratios.
