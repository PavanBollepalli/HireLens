from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas import LoginRequest, LoginResponse, SignupRequest
from ..core.security import authenticate_user, create_access_token, get_password_hash
from ..database import get_db, User

router = APIRouter()


@router.post("/signup", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
	existing = db.query(User).filter(User.email == payload.email).first()
	if existing:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

	user = User(
		email=payload.email,
		hashed_password=get_password_hash(payload.password),
		full_name=payload.full_name,
		role=payload.role,
	)
	db.add(user)
	db.commit()
	db.refresh(user)

	token = create_access_token(sub=user.email, role=user.role.value)
	return LoginResponse(
		access_token=token,
		role=user.role.value,
		user_email=user.email,
		full_name=user.full_name,
	)


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
	user = authenticate_user(db, payload.email, payload.password)
	if not user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
	if not user.is_active:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

	token = create_access_token(sub=user.email, role=user.role.value)
	return LoginResponse(
		access_token=token,
		role=user.role.value,
		user_email=user.email,
		full_name=user.full_name,
	)
