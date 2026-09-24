import os
import re
from typing import List, Dict, Any
from pypdf import PdfReader
from docx import Document as DocxDocument
from pptx import Presentation

class DocumentParser:
    @staticmethod
    def _fallback_raw_text(file_path: str) -> str:
        """Extracts readable ASCII/Unicode text strings from binary or unstructured files."""
        try:
            with open(file_path, "rb") as f:
                data = f.read()
            # Find sequence of printable characters
            strings = re.findall(rb'[a-zA-Z0-9.,;:!?\'"()\-\s]{4,}', data)
            decoded = [s.decode('latin-1', errors='ignore').strip() for s in strings if len(s.strip()) > 10]
            return "\n\n".join(decoded)
        except Exception:
            return ""

    @staticmethod
    def parse_pdf(file_path: str) -> List[Dict[str, Any]]:
        pages = []
        try:
            reader = PdfReader(file_path)
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages.append({
                    "page_number": idx + 1,
                    "text": text.strip()
                })
        except Exception as e:
            raw = DocumentParser._fallback_raw_text(file_path)
            if raw:
                pages.append({"page_number": 1, "text": raw})
            else:
                raise ValueError(f"Failed to parse PDF file: {str(e)}")
        return pages if pages else [{"page_number": 1, "text": ""}]

    @staticmethod
    def parse_docx(file_path: str) -> List[Dict[str, Any]]:
        pages = []
        try:
            doc = DocxDocument(file_path)
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            for table in doc.tables:
                for row in table.rows:
                    row_text = [c.text.strip() for c in row.cells if c.text.strip()]
                    if row_text:
                        full_text.append(" | ".join(row_text))

            combined_text = "\n\n".join(full_text)
            if not combined_text:
                combined_text = DocumentParser._fallback_raw_text(file_path)

            page_len = 1800
            total_pages = max(1, (len(combined_text) + page_len - 1) // page_len)
            for p in range(total_pages):
                start = p * page_len
                end = min(len(combined_text), (p + 1) * page_len)
                pages.append({
                    "page_number": p + 1,
                    "text": combined_text[start:end].strip()
                })
        except Exception as e:
            raw = DocumentParser._fallback_raw_text(file_path)
            if raw:
                pages.append({"page_number": 1, "text": raw})
            else:
                raise ValueError(f"Failed to parse Word document: {str(e)}")
        return pages if pages else [{"page_number": 1, "text": ""}]

    @staticmethod
    def parse_pptx(file_path: str) -> List[Dict[str, Any]]:
        pages = []
        try:
            prs = Presentation(file_path)
            for idx, slide in enumerate(prs.slides):
                slide_text = []
                for shape in slide.shapes:
                    if shape.has_text_frame:
                        for para in shape.text_frame.paragraphs:
                            if para.text.strip():
                                slide_text.append(para.text.strip())
                    elif shape.has_table:
                        for row in shape.table.rows:
                            row_vals = [c.text.strip() for c in row.cells if c.text.strip()]
                            if row_vals:
                                slide_text.append(" | ".join(row_vals))
                    elif hasattr(shape, "text") and shape.text.strip():
                        slide_text.append(shape.text.strip())

                # Check slide notes
                if slide.has_notes_slide and slide.notes_slide.notes_text_frame:
                    notes = slide.notes_slide.notes_text_frame.text.strip()
                    if notes:
                        slide_text.append(f"Notes: {notes}")

                pages.append({
                    "page_number": idx + 1,
                    "text": "\n".join(slide_text).strip()
                })
        except Exception as e:
            # Fallback for legacy .ppt binary files or non-standard archives
            raw = DocumentParser._fallback_raw_text(file_path)
            if raw:
                # Divide into approx slides
                slide_len = 1200
                total_slides = max(1, (len(raw) + slide_len - 1) // slide_len)
                for s in range(total_slides):
                    start = s * slide_len
                    end = min(len(raw), (s + 1) * slide_len)
                    pages.append({
                        "page_number": s + 1,
                        "text": raw[start:end].strip()
                    })
            else:
                raise ValueError(f"Failed to parse PowerPoint presentation: {str(e)}")
        return pages if pages else [{"page_number": 1, "text": ""}]

    @staticmethod
    def parse_txt(file_path: str) -> List[Dict[str, Any]]:
        pages = []
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            
            page_len = 1800
            total_pages = max(1, (len(content) + page_len - 1) // page_len)
            for p in range(total_pages):
                start = p * page_len
                end = min(len(content), (p + 1) * page_len)
                pages.append({
                    "page_number": p + 1,
                    "text": content[start:end].strip()
                })
        except Exception as e:
            raw = DocumentParser._fallback_raw_text(file_path)
            if raw:
                pages.append({"page_number": 1, "text": raw})
            else:
                raise ValueError(f"Failed to parse text file: {str(e)}")
        return pages if pages else [{"page_number": 1, "text": ""}]

    @classmethod
    def parse_file(cls, file_path: str, file_type: str) -> List[Dict[str, Any]]:
        file_type = file_type.lower().strip(".")
        if file_type == "pdf":
            return cls.parse_pdf(file_path)
        elif file_type in ["docx", "doc"]:
            return cls.parse_docx(file_path)
        elif file_type in ["pptx", "ppt"]:
            return cls.parse_pptx(file_path)
        elif file_type in ["txt", "md", "csv", "log", "rtf", "json"]:
            return cls.parse_txt(file_path)
        else:
            return cls.parse_txt(file_path)
