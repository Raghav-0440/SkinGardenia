@echo off
echo Starting Skin Herb Sanctuary AI services...

echo Starting ML Service...
start cmd /k "cd backend\src && python ml_service.py"

echo Starting Node Backend...
start cmd /k "cd backend && npm run dev"

echo Starting Frontend...
start cmd /k "npm run dev"

echo All services started!
echo ML Service: http://localhost:5001
echo Node Backend: http://localhost:3001
echo Frontend: http://localhost:5173 