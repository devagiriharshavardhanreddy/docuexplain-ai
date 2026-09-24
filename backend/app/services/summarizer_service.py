import re
from typing import List, Dict, Any
from app.services.llm_service import llm_service

class SummarizerService:
    @staticmethod
    def summarize_document(
        document_name: str,
        chunks: List[Dict[str, Any]],
        summary_type: str = "detailed"
    ) -> Dict[str, Any]:
        if not chunks:
            return {
                "document_name": document_name,
                "summary_type": summary_type,
                "content": "No content available in document to summarize.",
                "key_points": [],
                "action_items": [],
                "important_terms": []
            }

        # Combine text from chunks
        full_text = "\n\n".join([c.get("clean_content", c.get("content", "")) for c in chunks])
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', full_text) if len(s.strip()) > 25]

        # Extract potential terms (capitalized words / phrases)
        term_candidates = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', full_text)
        term_counts = {}
        for t in term_candidates:
            if len(t) > 3 and t not in ['The', 'This', 'That', 'These', 'Those', 'Document', 'Page', 'Section', 'Figure', 'Table']:
                term_counts[t] = term_counts.get(t, 0) + 1
        
        sorted_terms = sorted(term_counts.items(), key=lambda x: x[1], reverse=True)[:6]
        important_terms = []
        for term, count in sorted_terms:
            # Find a defining sentence for the term
            def_sentence = next((s for s in sentences if term.lower() in s.lower()), f"Key conceptual entity appearing {count} times across the document.")
            important_terms.append({"term": term, "definition": def_sentence})

        # Key points
        key_points = [s for s in sentences[:8] if not s.startswith("http")]

        # Action items (sentences with should, must, will, ensure, recommend, require, deadline, action)
        action_verbs = ['must', 'should', 'will', 'require', 'ensure', 'recommend', 'deadline', 'implement', 'action', 'review']
        action_items = []
        for s in sentences:
            if any(re.search(rf'\b{verb}\b', s, re.IGNORECASE) for verb in action_verbs):
                if s not in action_items:
                    action_items.append(s)
            if len(action_items) >= 5:
                break

        if not action_items and sentences:
            action_items = [f"Review findings and recommendations outlined in {document_name}."]

        # Generate summary content based on summary_type
        if summary_type == "short":
            content = " ".join(sentences[:3]) if sentences else "Document overview summary."
        elif summary_type == "executive":
            content = (
                f"### Executive Briefing: {document_name}\n\n"
                f"**Strategic Objective:**\n{sentences[0] if sentences else 'Document review'}\n\n"
                f"**Key Findings & Synthesis:**\n" +
                ("\n".join([f"- {s}" for s in sentences[1:5]]) if len(sentences) > 1 else "- Comprehensive analysis completed.")
            )
        elif summary_type == "key_points":
            content = "### Key Takeaways:\n\n" + "\n".join([f"- {s}" for s in key_points])
        elif summary_type == "terms":
            terms_md = "\n".join([f"- **{t['term']}**: {t['definition']}" for t in important_terms])
            content = f"### Important Terms & Definitions in {document_name}:\n\n{terms_md}"
        elif summary_type == "action_items":
            actions_md = "\n".join([f"- [ ] {a}" for a in action_items])
            content = f"### Action Items & Next Steps:\n\n{actions_md}"
        else: # detailed
            content = (
                f"### Comprehensive Document Summary: {document_name}\n\n"
                f"**Introduction & Context:**\n{sentences[0] if sentences else ''}\n\n"
                f"**Core Analysis & Findings:**\n" +
                (" ".join(sentences[1:6]) if len(sentences) > 1 else "") +
                f"\n\n**Conclusion:**\n{sentences[-1] if len(sentences) > 6 else 'End of document review.'}"
            )

        return {
            "document_name": document_name,
            "summary_type": summary_type,
            "content": content,
            "key_points": key_points[:6],
            "action_items": action_items[:5],
            "important_terms": important_terms,
        }

summarizer_service = SummarizerService()
