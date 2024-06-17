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
from gcp import generate_upload_signed_url_v4
from utils import (
    generate_token,
    verify_password,
    get_password_hash,
    verify_token,
    security,
    get_current_user,
)
from datetime import datetime
# from typing import Annotated
from settings import BASE_URL


router = APIRouter(
    prefix=f"{BASE_URL}/history",
    tags=["History"],
)


@router.get("/list")
def history(user: HTTPAuthorizationCredentials = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.History).all()


@router.post("/history")
def create_history(
    history: schemas.History,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        logger.info(history.description)
        logger.info(user.get("user_id"))
        history_data = history.dict()
        logger.info(history_data)
        history_data["type"] = models.HistoryType[history_data["history_type"]]
        history_data.pop("history_type")
        history = models.History(
            **history_data,
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        media = models.Media(
            url=f"images/animal_history_image_{history.id}.jpg",
            type="image",
            uploaded_by_user_id=user.get("user_id"),
            date=datetime.now(),
            animal_id=history.animal_id,
        )
        db.add(media)
        db.commit()
        url = generate_upload_signed_url_v4("tere-media-bucket", f"images/animal_history_image_{history.id}.jpg")
        return {
                # "history": history,
                "message": "Animal created successfully",
                "upload_url":  url
        }
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail="Error creating history")
