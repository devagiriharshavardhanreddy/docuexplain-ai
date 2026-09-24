from typing import List, Dict, Any
from app.config import settings
from app.services.text_cleaner import TextCleaner

class DocumentChunker:
    @staticmethod
    def chunk_document(
        pages: List[Dict[str, Any]],
        chunk_size: int = settings.CHUNK_SIZE,
        chunk_overlap: int = settings.CHUNK_OVERLAP
    ) -> List[Dict[str, Any]]:
        chunks = []
        global_chunk_idx = 0

        for page in pages:
            page_num = page["page_number"]
            raw_text = page["text"]
            clean_text = TextCleaner.clean(raw_text)

            if not clean_text:
                continue

            # If page text is smaller than chunk size, use as a single chunk
            if len(clean_text) <= chunk_size:
                chunks.append({
                    "chunk_index": global_chunk_idx,
                    "page_number": page_num,
                    "content": raw_text,
                    "clean_content": clean_text,
                    "token_count": len(clean_text.split())
                })
                global_chunk_idx += 1
                continue

            # Split into overlapping windows by sentence or paragraph
            start = 0
            text_len = len(clean_text)

            while start < text_len:
                end = min(start + chunk_size, text_len)
                
                # Try to break at paragraph or sentence boundary if not at end
                if end < text_len:
                    # Look for sentence end punctuation (. ! ? \n)
                    window = clean_text[start:end]
                    boundary = -1
                    for punct in ['\n\n', '\n', '. ', '? ', '! ']:
                        pos = window.rfind(punct)
                        if pos != -1 and pos > chunk_size // 3:
                            boundary = pos + len(punct)
                            break
                    if boundary != -1:
                        end = start + boundary

                chunk_str = clean_text[start:end].strip()
                if chunk_str:
                    chunks.append({
                        "chunk_index": global_chunk_idx,
                        "page_number": page_num,
                        "content": chunk_str,
                        "clean_content": chunk_str,
                        "token_count": len(chunk_str.split())
                    })
                    global_chunk_idx += 1

                if end >= text_len:
                    break

                # Advance with overlap
                start = max(start + 1, end - chunk_overlap)

        return chunks
