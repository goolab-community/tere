from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from .history import PostMedia

# from datetime import datetime
# from .history import Media


class PostStatus(Enum):
    """
    Post status enum
    """

    draft = "draft"
    published = "published"
    archived = "archived"


class PostComment(BaseModel):
    """
    Comment Schema
    """

    content: str


class PostLike(BaseModel):
    """
    Likes Schema
    """

    post_id: int
    user_id: int


class PostSave(BaseModel):
    """
    Saves Schema
    """

    post_id: int
    user_id: int


class BasePostCategory(BaseModel):
    """
    Base Categories schema
    for adding into posts without description
    """

    name: str


class PostCategory(BasePostCategory):
    """
    Categories Schema
    """

    description: str


class PostCategoryAssociation(BaseModel):
    """
    Association Schema for Post and Categories
    """

    post_id: int
    category_id: int


class PostTag(BaseModel):
    """
    Tags Schema
    """

    name: str


class PostTagAssociation(BaseModel):
    """
    Association Schema for Post and Tags
    """

    post_id: int
    tag_id: int


class Post(BaseModel):
    """
    Post Schema
    """

    title: str
    content: str
    status: str = "draft"
    # views: int = 0
    medias: Optional[List[PostMedia]] = None
    categories: Optional[List[BasePostCategory]] = None
    tags: Optional[List[PostTag]] = None
