@echo off
echo ==============================================================================
echo  DocuExplain AI - AI Document Intelligence with Explainable AI (XAI)
echo  "Understand Your Documents. Trust Every Answer."
echo ==============================================================================
echo.

:: Start Backend in new window
echo [1/2] Launching FastAPI Backend on http://localhost:8000...
start "DocuExplain AI - Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Start Frontend in new window
echo [2/2] Launching React+Vite Frontend on http://localhost:5173...
start "DocuExplain AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==============================================================================
echo  Platform is running!
echo  - Frontend Web UI:  http://localhost:5173
echo  - Backend API Docs: http://localhost:8000/docs
echo  - One-Click Demo:   researcher@docuexplain.ai (Password: DemoUser2026!)
echo ==============================================================================
