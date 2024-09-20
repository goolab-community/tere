from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime


class HistoryType(Enum):
    '''
    History type enum
    '''
    lost = 'lost'
    found = 'found'
    sighting = 'sighting'
    adoption = 'adoption'
    death = 'death'
    other = 'other'


class MediaType(Enum):
    '''
    Media type enum
    '''
    image = 'image'
    video = 'video'
    audio = 'audio'
    document = 'document'


class BaseMedia(BaseModel):
    url: str
    type: MediaType
    uploaded_by_user_id: Optional[int] = None
    date: Optional[datetime] = None
    description: Optional[str] = None


class Media(BaseMedia):
    animal_id: Optional[int] = None


class PostMedia(BaseMedia):
    post_id: Optional[int] = None


class History(BaseModel):
    animal_id: int
    history_type: Optional[str] = None
    user_id: int
    health_scale: Optional[int] = None
    description: Optional[str] = None
    date: str
    media_available: bool = False
    media_link: Optional[str] = None
    autocheck: bool
