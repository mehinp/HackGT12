@echo off
cd /d %~dp0
echo Activating venv...
call .venv\Scripts\activate.bat
echo Starting chatbot backend...
python -m uvicorn app:app --reload --port 8081
pause
