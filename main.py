from fastapi import FastAPI
from config import session
from fastapi import Depends
from sqlalchemy.orm import Session
import models.User_models as User_models
from schemas.UserSchemas import  UserCreate , UserResponse
User_models.Base.metadata.create_all(bind=session().get_bind()) 
app=FastAPI()

def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greeting():
    return {"message":"Welcome to HireLens"}

@app.get("/users")
def get_all_users(db:Session=Depends(get_db)):
    users=db.query(User_models.User).all()
    if not users:
        return {"message":"No users found"}
    return users

@app.post("/users")
def create_user(user:UserCreate,db:Session=Depends(get_db)):
    try:
        db_user=User_models.User(
            name=user.name,
            email=user.email,
            goal=user.goal,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return UserResponse(
            id=db_user.id,
            name=db_user.name,
            email=db_user.email,
            goal=db_user.goal,
            role=db_user.role
        )
    except Exception as e:
        db.rollback()
        return {"error":str(e)}

@app.get("/users/{user_id}")
def get_user(user_id:int,db:Session=Depends(get_db)):
    user=db.query(User_models.User).filter(User_models.User.id==user_id).first()
    if not user:
        return {"message":"User not found"}
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        goal=user.goal,
        role=user.role
    )