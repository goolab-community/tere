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


class Media(BaseModel):
    url: str
    type: MediaType
    uploaded_by_user_id: Optional[int] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    animal_id: Optional[int] = None


class History(BaseModel):
    user_id: int
    animal_id: int
    history_type: HistoryType = Field(alias='type')
    description: Optional[str] = None
    date: str
    autocheck: bool
