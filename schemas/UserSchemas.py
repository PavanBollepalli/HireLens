from pydantic import BaseModel, Field, field_validator
from enum import Enum
from typing import Optional

class UserRole(str, Enum):
    job_seeker = "job_seeker"
    employer = "employer"

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5)
    goal: Optional[str] = Field(None, min_length=10, max_length=500)  # Can be null
    role: UserRole
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email format')
        return v

class UserResponse(BaseModel):
    id: int
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    goal: Optional[str] = None  # Can be null
    role: UserRole