# HireLens - ATS Resume Analyzer

## Prerequisites
- Node.js 18+
- Python 3.10+

## Backend (FastAPI)

```bash
cd server
python -m venv .venv
# Windows PowerShell:
. .venv/Scripts/Activate.ps1
# or Git Bash:
source .venv/Scripts/activate

pip install -r requirements.txt

# Run API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Environment variables (optional):
- `JWT_SECRET` - secret for signing JWT tokens

## Frontend (React + Vite + TS)

```bash
cd client
npm install
# set API URL if needed (default http://localhost:8000)
# echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

Open `http://localhost:5173`.

## Demo Accounts
- Job Seeker: `seeker@example.com` / `password`
- HR: `hr@example.com` / `password`

## Features
- Role-based login (Job Seeker, HR)
- Single resume ATS scoring: paste JD, upload PDF
- Batch scoring for HR: paste JD, upload multiple PDFs, ranked results and best candidate
- ATS scoring combines TF-IDF cosine similarity and keyword coverage

## Notes
- PDF parsing uses `PyPDF2`. Complex PDFs may extract imperfectly.
- This is a demo; replace in-memory users with a database for production.
