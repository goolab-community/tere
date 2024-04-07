from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Numeric,
    Enum,
    Table
)
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel
from database import Base


class Specie(enum.Enum):
    cat = 'cat'
    dog = 'dog'
    rabbit = 'rabbit'
    bird = 'bird'
    fish = 'fish'
    turtle = 'turtle'
    hamster = 'hamster'
    guinea_pig = 'guinea_pig'


class Sex(enum.Enum):
    male = 'male'
    female = 'female'


class Breed(BaseModel):
    '''
    Bread
    '''
    __tablename__ = "breeds"
    id = Column(Integer, primary_key=True, index=True)
    specie = Column(Enum(Specie))
    name = Column(String)


class Animal(BaseModel):
    '''
    Animal model
    '''
    __tablename__ = "animals"

    species = Column(Enum(Specie))
    sex = Column(Enum(Sex))
    bread_id = Column(Integer, ForeignKey('breeds.id'))
    breed = relationship("Breed")
    tag_id = Column(String)
    rfid_code = Column(String)
    age_year = Column(Integer)
    age_month = Column(Integer)
    age_year_from = Column(Integer)
    age_month_from = Column(Integer)
    age_year_to = Column(Integer)
    age_month_to = Column(Integer)
    name = Column(String)
    description = Column(String)

    medias = relationship("Media", back_populates="animal")

    latitude = Column(Numeric)
    longitude = Column(Numeric)
    address = Column(String)

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="animals")
    # last_event_id = Column(Integer, ForeignKey('history.id'))
    # last_event = relationship("History", back_populates="animals")
    events = relationship("History", back_populates="animal")


association_table = Table(
    "user_animal_association_table",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("animal_id", ForeignKey("animals.id"), primary_key=True),
)
