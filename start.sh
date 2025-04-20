#!/bin/bash

echo "Starting Remove BG for FREE..."
echo

# Start the Flask backend
echo "Starting Flask backend..."
(cd backend && python -m venv venv 2>/dev/null || true && source venv/bin/activate && pip install -r requirements.txt && python app.py) &

# Start the Next.js frontend
echo "Starting Next.js frontend..."
npm run dev &

echo
echo "Servers are starting!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo

# Keep the script running
wait 