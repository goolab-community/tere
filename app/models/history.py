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
from .base import BaseModel, BaseMedia


class HistoryType(enum.Enum):
    """
    History type enum
    """

    feed = "feed"
    lost = "lost"
    found = "found"
    sighting = "sighting"
    adoption = "adoption"
    death = "death"
    other = "other"


class MediaType(enum.Enum):
    """
    Media type enum
    """

    image = "image"
    icon = "icon"
    video = "video"
    audio = "audio"
    document = "document"


class History(BaseModel):
    """
    History
    """

    __tablename__ = "history"

    animal_id = Column(Integer, ForeignKey("animals.id"))
    animal = relationship("Animal", back_populates="events")

    type = Column(Enum(HistoryType))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="events")

    health_scale = Column(Integer, nullable=True)
    description = Column(String)
    date = Column(DateTime, default=func.now())
    media_link = Column(String)
    autocheck = Column(Boolean, default=False)

    def to_json(self):
        return {
            "id": self.id,
            "animal_id": self.animal_id,
            "type": self.type,
            "user_id": self.user_id,
            "health_scale": self.health_scale,
            "description": self.description,
            "date": self.date,
            "media_link": self.media_link,
            "autocheck": self.autocheck,
        }


class Media(BaseMedia):
    """
    Media
    """

    __tablename__ = "media"

    type = Column(Enum(MediaType))

    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=True)
    animal = relationship("Animal", back_populates="medias")

    def to_json(self):
        return {
            "id": self.id,
            "url": self.url,
            "type": self.type,
            "uploaded_by_user_id": self.uploaded_by_user_id,
            "date": self.date,
            "description": self.description,
            "animal_id": self.animal_id,
        }


class PostMedia(BaseMedia):
    """
    Post Media
    """

    __tablename__ = "post_media"

    type = Column(Enum(MediaType))

    uploaded_by = relationship("User", backref="post_medias")

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    post = relationship("Post", back_populates="medias")

    def to_json(self):
        return {
            "id": self.id,
            "url": self.url,
            "type": self.type,
            "uploaded_by_user_id": self.uploaded_by_user_id,
            "date": self.date,
            "description": self.description,
            "post_id": self.post_id,
        }
