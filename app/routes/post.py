from fastapi import Depends, HTTPException, APIRouter, status
from fastapi.security import HTTPAuthorizationCredentials
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_  # noqa
from utils import logger, get_current_user
from settings import BASE_URL
from datetime import datetime

router = APIRouter(
    prefix=f"{BASE_URL}/post",
    tags=["Post"],
)


@router.get("/post")
def post(post_id: int, db: Session = Depends(get_db)):
    try:
        post = db.query(models.Post).filter(models.Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post.to_json()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/posts")
def posts(db: Session = Depends(get_db)):
    return [post.to_json() for post in db.query(models.Post).all()]


@router.get("/posts_paginated")
def posts_paginated(
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    offset: int = 0,
    limit: int = 10,
    search: str = None,
    order_by: str = "id",
    direction: str = "asc",
    db: Session = Depends(get_db),
):
    """Paginated Search for posts"""
    default_resp = {"data": [], "count": 0}
    try:
        if search is None:
            query = db.query(models.Post)
        else:
            query = db.query(models.Post).filter(
                or_(
                    models.Post.title.ilike(f"%{search}%"),
                    models.Post.content.ilike(f"%{search}%"),
                )
            )
        query = query.order_by(
            getattr(models.Post, order_by).asc()
            if direction == "asc"
            else getattr(models.Post, order_by).desc()
        )
        count = query.count()
        query = query.offset(offset).limit(limit).all()
    except SQLAlchemyError as e:
        logger.error(e)
        return default_resp, status.HTTP_500_INTERNAL_SERVER_ERROR
    return {"data": [post.to_json() for post in query], "count": count}


@router.post("/add", response_model=dict)
def add_post(
    post: schemas.Post,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        new_post = models.Post(
            user_id=user.get("user_id"),
            title=post.title,
            content=post.content,
            created_at=datetime.now(),
            status=post.status,
        )

        # Checks if categories are provided to validate them
        if post.categories:
            category_names = [category.name for category in post.categories]
            db_categories = (
                db.query(models.PostCategories)
                .filter(models.PostCategories.name.in_(category_names))
                .all()
            )

            if len(db_categories) != len(category_names):
                raise HTTPException(
                    status_code=400, detail="Some categories not found"
                )

            for db_category in db_categories:
                category_association = models.PostCategoriesAssociation(
                    post_id=new_post.id, category_id=db_category.id
                )
                new_post.category_association.append(category_association)

        # Checks if tags are provided to validate them
        if post.tags:
            tag_names = [tag.name for tag in post.tags]
            db_tags = (
                db.query(models.PostTags)
                .filter(models.PostTags.name.in_(tag_names))
                .all()
            )

            if len(db_tags) != len(tag_names):
                raise HTTPException(
                    status_code=400, detail="Some tags not found"
                )

            # Adds tags to the post
            for db_tag in db_tags:
                tag_association = models.PostTagsAssociation(
                    post_id=new_post.id, tag_id=db_tag.id
                )
                new_post.tag_association.append(tag_association)

        # Saves new post to the database
        db.add(new_post)
        db.commit()

        return {"message": "Post added successfully"}, status.HTTP_201_CREATED

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/edit/{post_id}", response_model=dict)
def edit_post(
    post_id: int,
    post: schemas.Post,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if user.get("is_superuser"):
            query = db.query(models.Post).filter_by(id=post_id).one_or_none()
        else:
            query = (
                db.query(models.Post)
                .filter_by(post_id=post_id, user_id=user.get("user_id"))
                .one_or_none()
            )
        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")
        query.title = post.title
        query.content = post.content
        query.status = post.status
        if post.categories:
            category_names = [category.name for category in post.categories]
            db_categories = (
                db.query(models.PostCategories)
                .filter(models.PostCategories.name.in_(category_names))
                .all()
            )

            if len(db_categories) != len(category_names):
                raise HTTPException(
                    status_code=400, detail="Some categories not found"
                )

            for db_category in db_categories:
                category_association = models.PostCategoriesAssociation(
                    post_id=query.id, category_id=db_category.id
                )
                query.category_association.append(category_association)

        # Checks if tags are provided to validate them
        if post.tags:
            tag_names = [tag.name for tag in post.tags]
            db_tags = (
                db.query(models.PostTags)
                .filter(models.PostTags.name.in_(tag_names))
                .all()
            )

            if len(db_tags) != len(tag_names):
                raise HTTPException(
                    status_code=400, detail="Some tags not found"
                )

            # Adds tags to the post
            for db_tag in db_tags:
                tag_association = models.PostTagsAssociation(
                    post_id=query.id, tag_id=db_tag.id
                )
                query.tag_association.append(tag_association)
        db.commit()

        return {"message": "Post Edited Successfully"}, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete/{post_id}", response_model=dict)
def delete_post(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        if user.get("is_superuser"):
            query = (
                db.query(models.Post)
                .filter(models.Post.id == post_id)
                .one_or_none()
            )
        else:
            query = (
                db.query(models.Post)
                .filter_by(post_id=post_id, user_id=user.get("user_id"))
                .one_or_none()
            )
        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")
        db.delete(query)
        db.commit()

        return {"message": "Post deleted successfully"}, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tags")
def get_tags(db: Session = Depends(get_db)):
    return [tag.to_json() for tag in db.query(models.PostTags).all()]


# Super user adds/edit/deletes tags and categories for now
# TODO: add editor status


@router.post("/tag/add")
def add_tag(
    tag: schemas.PostTag,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Superuser adds tags (TODO: add editor as well)
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        db_tag = models.PostTags(name=tag.name)
        db.add(db_tag)
        db.commit()
        return {"message": "Tag added successfully"}, status.HTTP_201_CREATED
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/tag/edit/{tag_id}")
def edit_tag(
    tag_id: int,
    tag: schemas.PostTag,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = db.query(models.PostTags).filter_by(id=tag_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        query.name = tag.name
        db.commit()
        return {"message": "Tag edited successfully"}, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/tag/delete/{tag_id}")
def delete_tag(
    tag_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = db.query(models.PostTags).filter_by(id=tag_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        db.delete(query)
        db.commit()
        return {"message": "Tag deleted successfully"}, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return [
        category.to_json()
        for category in db.query(models.PostCategories).all()
    ]


@router.post("/category/add")
def add_category(
    category: schemas.PostCategory,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        db_category = models.PostCategories(
            name=category.name, description=category.description
        )
        db.add(db_category)
        db.commit()
        return {
            "message": "Category added successfully"
        }, status.HTTP_201_CREATED
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/category/edit/{category_id}")
def edit_category(
    category_id: int,
    category: schemas.PostCategory,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = (
            db.query(models.PostCategories)
            .filter_by(id=category_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Category not found")
        query.name = category.name
        query.description = category.description
        db.commit()
        return {"message": "Category edited successfully"}, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/category/delete/{category_id}")
def delete_category(
    category_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.get("is_superuser"):
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = (
            db.query(models.PostCategories)
            .filter_by(id=category_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Category not found")
        db.delete(query)
        db.commit()
        return {
            "message": "Category deleted successfully"
        }, status.HTTP_200_OK
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
