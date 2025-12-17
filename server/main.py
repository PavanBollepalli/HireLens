from fastapi import FastAPI

app=FastAPI()

@app.get("/")
def greeting():
    return {"message":"Welcome to HireLens"}