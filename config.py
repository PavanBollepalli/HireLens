from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
uri="postgresql://postgres:06122004@localhost/hirelens"
engine = create_engine(uri)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)