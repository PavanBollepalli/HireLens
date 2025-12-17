from pydantic import BaseModel

class User(BaseModel):
    id:int
    name:str
    email:str
    age:int
    goal:str
    role:str
