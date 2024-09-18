from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
    Enum,
    func,
)
from .base import BaseModel
import enum

# from utils import logger


class PostStatus(enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class Post(BaseModel):
    """
    Post model
    """

    __tablename__ = "posts"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(String)
    status = Column(Enum(PostStatus), default=PostStatus.draft)
    # views = Column(Integer, default=0)

    likes = relationship("PostLikes", back_populates="post", lazy="dynamic")
    saves = relationship("PostSaves", back_populates="post", lazy="dynamic")
    category_association = relationship(
        "PostCategoriesAssociation", back_populates="post", lazy="dynamic"
    )
    tag_association = relationship(
        "PostTagsAssociation", back_populates="post", lazy="dynamic"
    )

    updated_at = Column(DateTime, onupdate=func.now(), default=func.now())

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "content": self.content,
            "status": self.status.value,
            "updated_at": self.updated_at,
            "likes": [like.to_json() for like in self.likes.all()],
            "saves": [save.to_json() for save in self.saves.all()],
            "category_association": [
                category.to_json()
                for category in self.category_association.all()
            ],
            "tag_association": [
                tag.to_json() for tag in self.tag_association.all()
            ],
        }


class PostComment(BaseModel):
    """
    Comment model for Post
    """

    __tablename__ = "post_comments"

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)

    updated_at = Column(DateTime, onupdate=func.now(), default=func.now())


class PostLikes(BaseModel):
    """
    Likes model for Posts
    """

    __tablename__ = "post_likes"

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Post", back_populates="likes")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "user_id": self.user_id,
        }


class PostSaves(BaseModel):
    """
    Saves model for Posts

    Will act as favoriting or saving for later,
    user can save many posts, and a post can be saved by many users
    """

    __tablename__ = "post_saves"

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Post", back_populates="saves")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "user_id": self.user_id,
        }


# Search Filtering for posts


class PostCategories(BaseModel):
    """
    Categories for Posts
    """

    __tablename__ = "post_categories"

    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    association = relationship(
        "PostCategoriesAssociation", back_populates="category"
    )

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }


class PostCategoriesAssociation(BaseModel):
    """
    Posts and their categories (Many to Many association)
    """

    __tablename__ = "post_categories_association"

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Post", back_populates="category_association")
    category_id = Column(
        Integer, ForeignKey("post_categories.id"), nullable=False
    )
    category = relationship("PostCategories", back_populates="association")

    def to_json(self):
        if isinstance(self.category, list):
            return {
                "id": self.id,
                "post_id": self.post_id,
                "category_id": self.category_id,
                "category": [c.to_json() for c in self.category],
            }
        return {
            "id": self.id,
            "post_id": self.post_id,
            "category_id": self.category_id,
            "category": self.category.to_json(),
        }


class PostTags(BaseModel):
    """
    Tags for Posts
    """

    __tablename__ = "post_tags"

    name = Column(String, unique=True, nullable=False)
    association = relationship("PostTagsAssociation", back_populates="tag")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class PostTagsAssociation(BaseModel):
    """
    Posts and their tags (Many to Many association)
    """

    __tablename__ = "post_tags_association"

    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Post", back_populates="tag_association")
    tag_id = Column(Integer, ForeignKey("post_tags.id"), nullable=False)
    tag = relationship("PostTags", back_populates="association")

    def to_json(self):
        if isinstance(self.tag, list):
            return {
                "id": self.id,
                "post_id": self.post_id,
                "tag_id": self.tag_id,
                "tag": [t.to_json() for t in self.tag],
            }
        return {
            "id": self.id,
            "post_id": self.post_id,
            "tag_id": self.tag_id,
            "tag": self.tag.to_json(),
        }
