from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    Numeric,
    Boolean,
    Enum,
    Table
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
import enum
from .base import BaseModel
from database import Base
from typing import List, Optional


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


# association_table = Table(
#     "user_animal_association_table",
#     Base.metadata,
#     Column("user_id", ForeignKey("users.id"), primary_key=True),
#     Column("animal_id", ForeignKey("animals.id"), primary_key=True),
# )


class Association(Base):
    __tablename__ = "user_animal_association_table"
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    animal_id: Mapped[int] = mapped_column(ForeignKey("animals.id"), primary_key=True)
    extra_data: Mapped[Optional[str]]
    animal: Mapped["Animal"] = relationship(back_populates="users")
    user: Mapped["User"] = relationship(back_populates="animals")


class Animal(BaseModel):
    '''
    Animal model
    '''
    __tablename__ = "animals"

    species = Column(Enum(Specie))
    sex = Column(Enum(Sex))
    breed_id = Column(Integer, ForeignKey('breeds.id'))
    breed = relationship("Breed")
    tag_id = Column(String, nullable=True)
    rfid_code = Column(String, nullable=True)
    age_year = Column(Integer, nullable=True)
    age_month = Column(Integer, nullable=True)
    age_year_from = Column(Integer, nullable=True)
    age_month_from = Column(Integer, nullable=True)
    age_year_to = Column(Integer, nullable=True)
    age_month_to = Column(Integer, nullable=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    overall_health = Column(Integer, nullable=True)

    medias = relationship("Media", back_populates="animal")

    latitude = Column(Numeric)
    longitude = Column(Numeric)
    address = Column(String, nullable=True)

    # user_id = Column(Integer, ForeignKey('users.id'))    # user = relationship("User", back_populates="animals")
    users: Mapped[List["Association"]] = relationship(back_populates="animal")
    # last_event_id = Column(Integer, ForeignKey('history.id'))
    # last_event = relationship("History", back_populates="animals")
    events = relationship("History", back_populates="animal")

    def to_json(self):
        return {
            "species": self.species,
            "sex": self.sex,
            "breed_id": self.breed_id,
            "tag_id": self.tag_id,
            "rfid_code": self.rfid_code,
            "age_year": self.age_year,
            "age_month": self.age_month,
            "age_year_from": self.age_year_from,
            "age_month_from": self.age_month_from,
            "age_year_to": self.age_year_to,
            "age_month_to": self.age_month_to,
            "name": self.name,
            "description": self.description,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "address": self.address
        }
