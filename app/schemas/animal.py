from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime
from .history import Media, History


class Specie(Enum):
    cat = 'cat'
    dog = 'dog'
    rabbit = 'rabbit'
    bird = 'bird'
    fish = 'fish'
    turtle = 'turtle'
    hamster = 'hamster'
    guinea_pig = 'guinea_pig'


class Sex(Enum):
    male = 'male'
    female = 'female'


class Breed(BaseModel):
    id: int
    specie: Specie
    name: str


class Animal(BaseModel):
    species: str
    sex: str = None
    breed_id: str = None
    tag_id: str = None
    rfid_code: str = None
    age_year: int = None
    age_month: int = None
    age_year_from: int = None
    age_month_from: int = None
    age_year_to: int = None
    age_month_to: int = None
    name: str = None
    description: str = None

    medias: Optional[List[Media]] = None

    latitude: float
    longitude: float
    address: Optional[str] = None

    # users: Optional[List["Association"]] = None
    history: Optional[List[History]] = None
