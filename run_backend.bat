@echo off
echo Starting Background Removal Backend...
echo.

cd backend
python -m venv venv 2>nul
call venv\Scripts\activate
pip install -r requirements.txt
python app.py

echo.
echo Press Ctrl+C to stop the server
echo. 