import time
import os
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from ..database import User, get_db

JWT_SECRET = os.getenv("JWT_SECRET", "devsecret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_SECONDS = 60 * 60 * 8  # 8 hours

auth_scheme = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
	return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
	return pwd_context.hash(password)


def authenticate_user(db: Session, email: str, password: str) -> User | None:
	user = db.query(User).filter(User.email == email).first()
	if not user:
		return None
	if not user.is_active:
		return None
	if not verify_password(password, user.hashed_password):
		return None
	return user


def create_access_token(sub: str, role: str) -> str:
	payload = {
		"sub": sub,
		"role": role,
		"iat": int(time.time()),
		"exp": int(time.time()) + JWT_EXPIRE_SECONDS,
	}
	return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
	creds: HTTPAuthorizationCredentials = Depends(auth_scheme),
	db: Session = Depends(get_db),
) -> User:
	try:
		token = creds.credentials
		payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
		email = payload.get("sub")
		if not email:
			raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
		user = db.query(User).filter(User.email == email).first()
		if not user:
			raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
		if not user.is_active:
			raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
		return user
	except jwt.ExpiredSignatureError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
	except Exception:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
