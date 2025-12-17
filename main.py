from fastapi import FastAPI
from config import session
from fastapi import Depends
from sqlalchemy.orm import Session
import database_models
from models import User 
database_models.Base.metadata.create_all(bind=session().get_bind()) 
app=FastAPI()

def get_db():
    db=session()
    try:
        yield db
        db.commit()
    finally:
        db.close()

@app.get("/")
def greeting():
    return {"message":"Welcome to HireLens"}

@app.get("/users")
def get_all_users(db:Session=Depends(get_db)):
    users=db.query(database_models.User).all()
    if not users:
        return {"message":"No users found"}
    return users

@app.post("/users")
def create_user(user:User,db:Session=Depends(get_db)):
    try:
        db_user=database_models.User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        return {"error":str(e)}
    return {"message":"User created successfully"}

@app.get("/users/{user_id}")
def get_user(user_id:int,db:Session=Depends(get_db)):
    user=db.query(database_models.User).filter(database_models.User.id==user_id).first()
    if not user:
        return {"message":"User not found"}
    return user