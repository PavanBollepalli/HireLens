from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, analyze

app = FastAPI(title="HireLens ATS API", version="0.1.0")

# CORS configuration (adjust origins for production)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])


@app.get("/")
async def root():
	return {"status": "ok", "service": "HireLens ATS API"}
