from pydantic import BaseModel
from enum import Enum

class UserRole(str, Enum):
    job_seeker = "job_seeker"
    employer = "employer"

class User(BaseModel):
    name:str
    email:str
    goal:str
    role:UserRole
