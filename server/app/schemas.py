from pydantic import BaseModel
from typing import List, Optional


class LoginRequest(BaseModel):
	email: str
	password: str


class LoginResponse(BaseModel):
	access_token: str
	token_type: str = "bearer"
	role: str
	user_email: str


class ATSResult(BaseModel):
	filename: Optional[str] = None
	score: float
	keyword_match: float
	summary: str


class BatchATSResponse(BaseModel):
	results: List[ATSResult]
	best_candidate: Optional[str]
