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

Environment variables:
- `DATABASE_URL` - PostgreSQL connection string (defaults to `postgresql://postgres:postgres@localhost:5432/hirelens`)
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

## Accounts
- Visit `http://localhost:5173/signup` to create a Job Seeker or HR account.
- If you prefer seeded credentials, insert users directly into the `users` table with hashed passwords (bcrypt via `passlib`).

## Features
- Role-based login (Job Seeker, HR)
- Single resume ATS scoring: paste JD, upload PDF
- Batch scoring for HR: paste JD, upload multiple PDFs, ranked results and best candidate
- ATS scoring combines TF-IDF cosine similarity and keyword coverage

## Notes
- PDF parsing uses `PyPDF2`. Complex PDFs may extract imperfectly.
- This is a demo; replace in-memory users with a database for production.
