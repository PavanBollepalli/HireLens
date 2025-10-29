from fastapi import APIRouter, HTTPException
from ..schemas import LoginRequest, LoginResponse
from ..core.security import authenticate_user, create_access_token

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
	user = authenticate_user(payload.email, payload.password)
	if not user:
		raise HTTPException(status_code=401, detail="Invalid credentials")
	token = create_access_token(sub=user["email"], role=user["role"])
	return LoginResponse(access_token=token, role=user["role"], user_email=user["email"])
