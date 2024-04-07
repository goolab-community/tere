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
    get_current_user
)
# from typing import Annotated
from settings import BASE_URL


router = APIRouter(
    prefix=f"{BASE_URL}/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(user: schemas.User, db: Session = Depends(get_db)):
    logger.info(user)
    # Check if user already exists in the database
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    logger.info(existing_user)
    logger.info("--------------------")
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")
    # hash user password
    user.password = get_password_hash(user.password)
    # Insert the new user into the database
    db.add(models.User(**user.dict()))
    db.commit()
    return {"message": "User created successfully! admin will approve your account soon."}


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.login).first()
        if not db_user:
            db_user = db.query(models.User).filter(models.User.username == user.login).first()
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid email or username")
        if not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=400, detail="Invalid password")
        if db_user.is_active:
            logger.info("Generating token...")
            token = generate_token(
                {"email": db_user.email, "username": db_user.username, "is_active": db_user.is_active}
            )
            user_dict = {"_id": str(db_user.id)}
            user_dict["token"] = token
            return user_dict
        else:
            raise HTTPException(status_code=400, detail="User is not active")
    except Exception as e:
        raise e
        return HTTPException(status_code=400, detail=str(e))


# @router.get("/api/user")
# def get_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
#     # Extract the token from the Authorization header
#     token = credentials.credentials
#     logger.info(token)
#     # decrypt the token
#     user_data = verify_token(token)
#     if user_data["email"]:
#         return user_data
#     raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/user")
def read_users_me(user: HTTPAuthorizationCredentials = Depends(get_current_user)):
    return {"str": "Do anything what you want", "user_email": user}
