from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from .database import UserRole


class LoginRequest(BaseModel):
	email: EmailStr
	password: str


class LoginResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"
	role: str
	user_email: str
	full_name: Optional[str] = None


class SignupRequest(BaseModel):
	email: EmailStr
	password: str = Field(min_length=6)
	full_name: Optional[str] = None
	role: UserRole = UserRole.JOB_SEEKER


class ATSResult(BaseModel):
	filename: Optional[str] = None
	score: float
	keyword_match: float
	summary: str


class BatchATSResponse(BaseModel):
	results: List[ATSResult]
	best_candidate: Optional[str]
