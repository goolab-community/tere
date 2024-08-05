from sqlalchemy import (
    Column,
    String,
    Boolean,
    ForeignKey,
    Table
)
from database import Base
from sqlalchemy.orm import relationship, Mapped
from .base import BaseModel
from typing import List, Optional


class User(BaseModel):
    '''
    User model
    '''
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

    # animals = relationship("Animal", back_populates="user")
    animals: Mapped[List["Association"]] = relationship(back_populates="user")

    events = relationship("History", back_populates="user")
    medias = relationship("Media", back_populates="uploaded_by")

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "country": self.country,
            "role": self.role,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "animals": [a.animal.to_json() for a in self.animals],
            "events": [e.to_json() for e in self.events],
            "medias": [m.to_json() for m in self.medias]
        }
