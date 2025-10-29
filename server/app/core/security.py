import time
import os
import jwt
from typing import Optional, Dict
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWT_SECRET = os.getenv("JWT_SECRET", "devsecret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = 60 * 60 * 8  # 8 hours

# Demo users. Replace with a database in production.
DEMO_USERS = {
	"seeker@example.com": {"password": "password", "role": "job_seeker"},
	"hr@example.com": {"password": "password", "role": "hr"},
}

auth_scheme = HTTPBearer()


def authenticate_user(email: str, password: str) -> Optional[Dict]:
	user = DEMO_USERS.get(email)
	if user and user["password"] == password:
		return {"email": email, "role": user["role"]}
	return None


def create_access_token(sub: str, role: str) -> str:
	payload = {
		"sub": sub,
		"role": role,
		"iat": int(time.time()),
		"exp": int(time.time()) + JWT_EXPIRE_SECONDS,
	}
	return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> Dict:
	try:
		token = creds.credentials
		payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
		return {"email": payload.get("sub"), "role": payload.get("role")}
	except jwt.ExpiredSignatureError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
	except Exception:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
