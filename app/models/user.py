from sqlalchemy import (
    Column,
    String,
    Boolean,
)
from sqlalchemy.orm import relationship
from .base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    password = Column(String, nullable=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip = Column(String)
    country = Column(String)
    role = Column(String)
    is_active = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)

    animals = relationship("Animal", back_populates="user")

    events = relationship("History", back_populates="user")
    medias = relationship("Media", back_populates="uploaded_by")
