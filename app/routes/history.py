from fastapi import FastAPI, Depends, HTTPException, APIRouter, status
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
    get_current_user,
)
# from typing import Annotated
from settings import BASE_URL


router = APIRouter(
    prefix=f"{BASE_URL}/history",
    tags=["History"],
)


@router.get("/history")
def history(user: HTTPAuthorizationCredentials = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.History).all()


@router.post("/history")
def create_history(
    history: schemas.History,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logger.info(user.get("user_id"))
    history_data = history.dict()
    logger.info(history_data)
    history_data["type"] = history_data["history_type"].value
    history_data.pop("history_type")
    history = models.History(
        **history_data,
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history
