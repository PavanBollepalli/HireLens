
from sqlalchemy import Column, Integer, String,Enum
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String,nullable=False)
    email = Column(String,nullable=False, unique=True)
    goal = Column(String,nullable=False)
    role = Column(Enum('job_seeker', 'employer', name='user_role'),nullable=False)