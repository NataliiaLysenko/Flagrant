# Flagrant

Flagrant treats modern *courtship* as data and analyzes it accordingly.

## Tech Stack
- Frontend: React + Vite
- Backend: Python (FastAPI)

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+

## 1. Clone
```bash
git clone https://github.com/NataliiaLysenko/Flagrant.git
cd Flagrant
```

## 2. Backend Setup

### Windows (PowerShell)
```powershell
cd backend
python -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### macOS / Linux
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create/update `backend/.env` with required keys.

Run backend:
```bash
uvicorn main:app --reload
```

Backend default URL: `http://localhost:8000`

## 3. Frontend Setup

Open a second terminal.

### Windows (PowerShell)
```powershell
cd frontend
npm install
npm run dev
```

### macOS / Linux
```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

