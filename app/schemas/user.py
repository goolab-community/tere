from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    '''
    User model
    '''
    username: str
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None


class UserLogin(BaseModel):
    '''
    User model
    '''
    login: str
    password: str
