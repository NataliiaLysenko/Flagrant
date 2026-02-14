# Flagrant

Silly compatibility checker + red-flag detector.

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

## Common Issues

### `node` / `npm` not recognized (Windows)
Install Node LTS:
```powershell
winget install OpenJS.NodeJS.LTS
```

If still not found:
```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
node -v
npm -v
```

### PowerShell blocks venv activation
Use session-only bypass:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### `npm ERR! enoent ... package.json`
Run npm commands from `frontend/`, not `backend/`.

## Day-to-Day Run
Terminal 1:
```bash
cd backend
uvicorn main:app --reload
```

Terminal 2:
```bash
cd frontend
npm run dev
```
