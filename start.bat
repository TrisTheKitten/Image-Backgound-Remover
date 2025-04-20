@echo off
echo Starting Remove BG for FREE...
echo.

echo Starting Flask backend...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python app.py"

echo Starting Next.js frontend...
start cmd /k "npm run dev"

echo.
echo Servers are starting!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo. 