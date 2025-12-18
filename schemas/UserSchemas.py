from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    job_seeker = "job_seeker"
    employer = "employer"

class UserCreate(BaseModel):
    name:str
    email:str
    goal:str
    role:UserRole

class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    goal:str
    role:UserRole