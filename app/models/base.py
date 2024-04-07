from sqlalchemy.orm import DeclarativeBase, mapped_column
from sqlalchemy import Column, DateTime, func, Integer
from database import Base


# declarative base class
class BaseModel(Base):
    __abstract__ = True

    id = mapped_column(Integer, primary_key=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())
