# DocuExplain AI — Sample Datasets & Recommended Test Queries

All sample files are pre-loaded in:
```
backend/sample_docs/
```

---

## 1. Available Sample Documents

| File Name | Format | Size | Description |
| :--- | :--- | :--- | :--- |
| **`DocuExplain_AI_Defense_Slides.pptx`** | PowerPoint Presentation | 5 Slides | Academic slides covering project objectives, submission deadlines, evaluation weightage (40% XAI), and RAG architecture. |
| **`Project_Guidelines_2026.pdf`** | PDF Document | 1 Page | Official guidelines specifying final defense timeline and functional requirements. |
| **`AI_Research_Report.docx`** | Word Document | 3 Sections | Research whitepaper discussing grounded synthesis, SentenceTransformers vectorization, and hallucination reduction. |
| **`Project_Guidelines_AI_Defense.txt`** | Text Document | 2 Pages | Comprehensive academic guidelines, submission date (August 15, 2026), and viva voce exam details. |
| **`Quantum_Computing_Executive_Report.txt`** | Text Document | 3 Pages | Deep-tech enterprise briefing on post-quantum cryptographic transitions (NIST standards). |
| **`Corporate_Cybersecurity_Policy_2026.txt`** | Text Document | 4 Pages | Enterprise security policy covering zero-trust access, MFA requirements, and incident response SLAs. |

---

## 2. Recommended Test Queries

### Query 1: Deadlines & Timeline
* **Question:** *"What is the final project submission and demonstration deadline?"*
* **Target Document:** `DocuExplain_AI_Defense_Slides.pptx` or `Project_Guidelines_AI_Defense.txt`
* **Expected Grounded Answer:** `August 15, 2026`
* **Expected XAI Output:** High Confidence ($\ge 90\%$), citation to *Page 3* or *Page 1*, with highlighted terms: `submission`, `deadline`, `August 15, 2026`.

### Query 2: Evaluation Weightage
* **Question:** *"What is the evaluation criteria weightage breakdown?"*
* **Target Document:** `DocuExplain_AI_Defense_Slides.pptx`
* **Expected Grounded Answer:** `40% Explainable AI (XAI) Transparency, 30% Retrieval Performance, 20% UI/UX Design, 10% Code Security`.
* **Expected XAI Output:** High Confidence ($\ge 85\%$), citation to *Slide 4*.

### Query 3: Multi-Format Ingestion Strategy
* **Question:** *"Which file formats are supported and how many stages are in the pipeline?"*
* **Target Document:** `AI_Research_Report.docx` or `DocuExplain_AI_Defense_Slides.pptx`
* **Expected Grounded Answer:** `PDF, Word DOCX, PowerPoint PPTX, and TXT across a 7-stage processing lifecycle`.

### Query 4: Anti-Hallucination Fallback Test
* **Question:** *"Who won the 1994 FIFA World Cup according to the uploaded guidelines?"*
* **Target Document:** Any uploaded document
* **Expected Fallback Response:**
  > *"I couldn't find sufficient evidence in the uploaded documents to answer this question."*
* **Expected XAI Output:** Low Confidence with Zero-Hallucination safeguard triggered.
