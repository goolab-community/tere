from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

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

    post_id: int
    user_id: int
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


class PostCategory(BaseModel):
    """
    Categories Schema
    """

    name: str
    description: Optional[str] = None


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
    status: PostStatus = PostStatus.draft
    # views: int = 0

    categories: Optional[List[PostCategory]] = None
    tags: Optional[List[PostTag]] = None
