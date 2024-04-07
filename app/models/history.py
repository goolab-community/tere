from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    func,
    Boolean,
    Enum,

)
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class HistoryType(enum.Enum):
    '''
    History type enum
    '''
    lost = 'lost'
    found = 'found'
    sighting = 'sighting'
    adoption = 'adoption'
    death = 'death'
    other = 'other'


class MediaType(enum.Enum):
    '''
    Media type enum
    '''
    image = 'image'
    video = 'video'
    audio = 'audio'
    document = 'document'


class History(BaseModel):
    '''
    History
    '''
    __tablename__ = "history"

    animal_id = Column(Integer, ForeignKey('animals.id'))
    animal = relationship("Animal", back_populates="events")

    type = Column(Enum(HistoryType))

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="events")

    description = Column(String)
    date = Column(DateTime, default=func.now())
    autocheck = Column(Boolean, default=False)


class Media(BaseModel):
    '''
    Media
    '''
    __tablename__ = "media"

    url = Column(String)
    type = Column(Enum(MediaType))

    uploaded_by_user_id = Column(Integer, ForeignKey('users.id'))
    uploaded_by = relationship("User", back_populates="medias")

    date = Column(DateTime, default=func.now())
    description = Column(String)

    animal_id = Column(Integer, ForeignKey('animals.id'))
    animal = relationship("Animal", back_populates="medias")
