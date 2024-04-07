from jwt import encode as jwt_encode, decode
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from datetime import datetime, timedelta, timezone
from .logs import logger
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from settings import API_SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def generate_token(email: str) -> str:
    payload = {"email": email}
    token = jwt_encode(payload, API_SECRET_KEY, algorithm="HS256")
    return token


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, API_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password, hashed_password):
    logger.info((plain_password, hashed_password))
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_token(token):
    return decode(token, API_SECRET_KEY, algorithms=[ALGORITHM])


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    user = verify_token(token.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
