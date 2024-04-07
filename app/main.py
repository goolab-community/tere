from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils import logger
from database import Base, engine
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session
from utils import (
    generate_token,
    verify_password,
    get_password_hash,
    verify_token,
    security,
    get_current_user
)
# from typing import Annotated
from settings import BASE_URL
from routes import auth, animal, history


Base.metadata.create_all(bind=engine)

app = FastAPI(
    docs_url=f"{BASE_URL}/docs",
    title="Tere API",
    version="0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# client = MongoClient("mongodb://root:example@tere-mongo:27017")
# db = client["mydatabase"]
# users_collection = db["users"]

app.include_router(auth.router)
app.include_router(animal.router)
app.include_router(history.router)
