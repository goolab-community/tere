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
from settings import BASE_URL, FRONTEND_APP_ADDRESS, FRONTEND_APP_PORT, DOMAIN_NAME
from routes import auth, animal, history


Base.metadata.create_all(bind=engine)

app = FastAPI(
    docs_url=f"{BASE_URL}/docs",
    title="Tere API",
    version="0.1",
)
if FRONTEND_APP_PORT:
    frontend_url = f"http://{FRONTEND_APP_ADDRESS}:{FRONTEND_APP_PORT}"
else:
    frontend_url = FRONTEND_APP_ADDRESS

logger.info(f"Frontend URL: {frontend_url}")

cors_origins = [frontend_url, "https://storage.googleapis.com"]

if DOMAIN_NAME:
    cors_origins.append(f"https://{DOMAIN_NAME}")

logger.info("")
logger.info("............................................")
logger.info(f"CORS origins: {cors_origins}")
logger.info("............................................")
logger.info("")


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Custom-Header"],
    max_age=3600
)

app.include_router(auth.router)
app.include_router(animal.router)
app.include_router(history.router)
