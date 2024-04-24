from .user import User
from .animal import Animal, Specie, Sex, Breed
from .history import History, Media
from .base import BaseModel


from sqlalchemy import (
    Column,
    ForeignKey,
    Table
)
from database import Base