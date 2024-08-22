from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
# from pymongo import MongoClient
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
from settings import BASE_URL, FRONTEND_APP_ADDRESS, FRONTEND_APP_PORT
from routes import auth, animal, history


Base.metadata.create_all(bind=engine)

app = FastAPI(
    docs_url=f"{BASE_URL}/docs",
    title="Tere API",
    version="0.1",
)

frontend_url = f"http://{FRONTEND_APP_ADDRESS}:{FRONTEND_APP_PORT}"

logger.info(f"Frontend URL: {frontend_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://{FRONTEND_APP_ADDRESS}:{FRONTEND_APP_PORT}", "https://storage.googleapis.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Custom-Header"],
    max_age=3600
)

app.include_router(auth.router)
app.include_router(animal.router)
app.include_router(history.router)
