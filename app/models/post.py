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
    status = Column(Enum(PostStatus))
    # views = Column(Integer, default=0)

    likes = relationship("PostLikes", backref="post")
    saves = relationship("PostSaves", backref="post")
    category_associacion = relationship(
        "PostCategoryAssociacion", backref="posts"
    )
    tag_associacion = relationship("PostTagAssociacion", backref="posts")

    updated_at = Column(DateTime, onupdate=func.now(), nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "content": self.content,
            "status": self.status.value,
            "updated_at": self.updated_at,
            "likes": [like.to_json() for like in self.likes],
            "saves": [save.to_json() for save in self.saves],
            "category_associacion": [
                category.to_json() for category in self.category_associacion
            ],
            "tag_associacion": [
                tag.to_json() for tag in self.tag_associacion
            ],
        }


class PostComment(BaseModel):
    """
    Comment model for Post
    """

    __tablename__ = "post_comments"

    post_id = Column(Integer, ForeignKey("posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=True)

    updated_at = Column(DateTime, onupdate=func.now(), nullable=True)


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
    associacion = relationship(
        "PostCategoriesAssociation", back_populates="categories"
    )

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }


class PostCategoriesAssociacion(BaseModel):
    """
    Posts and their categories (Many to Many association)
    """

    __tablename__ = "post_categories_association"

    post_id = Column(Integer, ForeignKey("posts.id"))
    posts = relationship("Post", back_populates="category_associacion")
    category_id = Column(Integer, ForeignKey("post_categories.id"))
    categories = relationship("PostCategories", back_populates="associacion")

    def to_json(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "category_id": self.category_id,
            "categories": [c.to_json() for c in self.categories]
        }


class PostTags(BaseModel):
    """
    Tags for Posts
    """

    __tablename__ = "post_tags"

    name = Column(String, unique=True, nullable=False)
    associacion = relationship("PostTagsAssociation", back_populates="tags")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class PostTagsAssociacion(BaseModel):
    """
    Posts and their tags (Many to Many association)
    """

    __tablename__ = "post_tags_association"

    post_id = Column(Integer, ForeignKey("posts.id"))
    posts = relationship("Post", back_populates="tag_associacion")
    tag_id = Column(Integer, ForeignKey("post_tags.id"))
    tags = relationship("PostTags", back_populates="associacion")

    def to_json(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "tag_id": self.tag_id,
            "tags": [t.to_json() for t in self.tags]
        }
