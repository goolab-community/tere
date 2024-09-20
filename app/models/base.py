from sqlalchemy.orm import DeclarativeBase, mapped_column, relationship
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import (
    Column,
    DateTime,
    func,
    Integer,
    String,
    Enum,
    ForeignKey,
    ForeignKey,
)
from database import Base


# declarative base class
class BaseModel(Base):
    __abstract__ = True

    id = mapped_column(Integer, primary_key=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now())


class BaseMedia(BaseModel):

    __abstract__ = True

    url = Column(String)

    @declared_attr
    def uploaded_by_user_id(cls):
        return Column(Integer, ForeignKey("users.id"))

    @declared_attr
    def uploaded_by(cls):
        return relationship("User", back_populates="medias")

    date = Column(DateTime, default=func.now())
    description = Column(String)