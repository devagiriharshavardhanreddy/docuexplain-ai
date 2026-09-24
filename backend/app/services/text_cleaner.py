import re

class TextCleaner:
    @staticmethod
    def clean(text: str) -> str:
        if not text:
            return ""
        
        # Replace non-breaking spaces and unicode spaces with regular space
        cleaned = re.sub(r'[\u00a0\u2000-\u200b\u2028\u2029]', ' ', text)
        
        # Replace multiple consecutive spaces/tabs with single space
        cleaned = re.sub(r'[ \t]+', ' ', cleaned)
        
        # Normalize newlines (max 2 consecutive newlines)
        cleaned = re.sub(r'\r\n|\r', '\n', cleaned)
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        
        # Strip trailing/leading spaces on lines
        lines = [line.strip() for line in cleaned.split('\n')]
        cleaned = '\n'.join(lines)
        
        return cleaned.strip()
