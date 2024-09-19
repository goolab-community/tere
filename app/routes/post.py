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
from typing import List

router = APIRouter(
    prefix=f"{BASE_URL}/post",
    tags=["Post"],
)


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
    """
    Paginated Search for posts

    order by will not work on: saves, likes, comments, tags, categories
    """
    # TODO: add support for those
    default_resp = {"data": [], "count": 0}

    try:
        if search is None:
            query = db.query(models.Post)
        else:
            query = db.query(models.Post).filter(
                or_(
                    models.Post.title.ilike(f"%{search}%"),
                    models.Post.content.ilike(f"%{search}%"),
                    models.Post.status.ilike(f"%{search}%"),
                )
            )
        if order_by in ["saves", "likes", "comments", "tags", "categories"]:
            raise HTTPException(
                status_code=501,
                message="Order by not implemented for: saves, likes,"
                + " comments, tags and categories",
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


@router.get("/get/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    try:
        post = db.query(models.Post).filter(models.Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post.to_json()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/add")
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
            logger.info("Tags are added")

        # Saves new post to the database
        db.add(new_post)
        db.commit()
        return {"message": "Post added successfully"}

    except Exception as e:
        logger.error(e)
        # logger.error("Exception occured: %s", e)
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/edit/{post_id}")
def edit_post(
    post_id: int,
    post: schemas.Post,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Checks if the user is an admin or the owner of the post
        # TODO: Move this repeated code to utils somehow
        admin_status = (
            db.query(models.User)
            .filter_by(id=user.get("user_id"), is_superuser=True)
            .one_or_none()
        )
        if admin_status:
            query = db.query(models.Post).filter_by(id=post_id).one_or_none()
        else:
            query = (
                db.query(models.Post)
                .filter_by(id=post_id, user_id=user.get("user_id"))
                .one_or_none()
            )

        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")

        # Update post fields
        query.title = post.title
        query.content = post.content
        query.status = post.status

        # Handle categories
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

            # Remove associations that are not in the new list
            query.category_association = [
                assoc
                for assoc in query.category_association
                if assoc.category.name in category_names
            ]

            # Add new associations that are not already there
            existing_category_ids = {
                assoc.category_id for assoc in query.category_association
            }
            for db_category in db_categories:
                if db_category.id not in existing_category_ids:
                    category_association = models.PostCategoriesAssociation(
                        post_id=query.id, category_id=db_category.id
                    )
                    query.category_association.append(category_association)

        # Handle tags
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

            query.tag_association = [
                assoc
                for assoc in query.tag_association
                if assoc.tag.name in tag_names
            ]

            existing_tag_ids = {
                assoc.tag_id for assoc in query.tag_association
            }
            for db_tag in db_tags:
                if db_tag.id not in existing_tag_ids:
                    tag_association = models.PostTagsAssociation(
                        post_id=query.id, tag_id=db_tag.id
                    )
                    query.tag_association.append(tag_association)

        db.commit()

        return {"message": "Post Edited Successfully"}

    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/delete/{post_id}", response_model=dict)
def delete_post(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        admin_status = (
            db.query(models.User)
            .filter_by(id=user.get("user_id"), is_superuser=True)
            .one_or_none()
        )
        if admin_status:
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
        tag_associations = (
            db.query(models.PostTagsAssociation)
            .filter_by(post_id=post_id)
            .all()
        )
        category_associations = (
            db.query(models.PostCategoriesAssociation)
            .filter_by(post_id=post_id)
            .all()
        )
        for association in tag_associations:
            db.delete(association)
        for association in category_associations:
            db.delete(association)
        db.delete(query)
        db.commit()

        return {"message": "Post deleted successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/like/add/{post_id}", response_model=dict)
def add_like(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = db.query(models.Post).filter_by(id=post_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")

        if user.get("user_id") in [like.user_id for like in query.likes]:
            raise HTTPException(
                status_code=400, detail="User already liked this post"
            )

        like = models.PostLikes(user_id=user.get("user_id"), post_id=post_id)
        db.add(like)
        db.commit()

        return {"message": "Post Liked successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/like/remove/{post_id}", response_model=dict)
def delete_like(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = (
            db.query(models.PostLikes)
            .filter_by(user_id=user.get("user_id"), post_id=post_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Like not found")
        db.delete(query)
        db.commit()

        return {"message": "Like removed successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/saves/get")
def get_users_saved_posts(
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = (
            db.query(models.PostSaves)
            .filter_by(user_id=user.get("user_id"))
            .all()
        )
        saved_posts = [
            {
                "id": save.post_id,
                "title": save.post.title,
                "content": save.post.content,
                "status": save.post.status,
                "created_at": save.post.created_at,
                "updated_at": save.post.updated_at,
                "saved_at": save.created_at,
                "author": {
                    "id": save.post.user_id,
                    "username": save.post.user.username,
                },
                "likes_count": len(save.post.likes.all()),
            }
            for save in query
        ]

        return {"saved_posts": saved_posts}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/save/add/{post_id}", response_model=dict)
def save_post(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = db.query(models.Post).filter_by(id=post_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")

        if user.get("user_id") in [save.user_id for save in query.saves]:
            raise HTTPException(
                status_code=400, detail="User already saved this post"
            )

        save = models.PostSaves(user_id=user.get("user_id"), post_id=post_id)
        db.add(save)
        db.commit()

        return {"message": "Post Saved successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/save/remove/{post_id}", response_model=dict)
def delete_save(
    post_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = (
            db.query(models.PostSaves)
            .filter_by(user_id=user.get("user_id"), post_id=post_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Save not found")
        db.delete(query)
        db.commit()

        return {"message": "Save removed successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/comments/{post_id}")
def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    try:
        # Joining PostComment with User model to get the username
        query = (
            db.query(models.PostComment)
            .filter(models.PostComment.post_id == post_id)
            .all()
        )

        result = [comment.to_json() for comment in query]
        return result

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/comment/add/{post_id}")
def add_comment(
    post_id: int,
    comment: schemas.PostComment,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = db.query(models.Post).filter_by(id=post_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Post not found")

        if not comment.content:
            raise HTTPException(status_code=400, detail="Content is required")

        new_comment = models.PostComment(
            user_id=user.get("user_id"),
            post_id=post_id,
            content=comment.content,
        )
        db.add(new_comment)
        db.commit()

        return {"message": "Comment added successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/comment/edit/{comment_id}")
def edit_comment(
    comment_id: int,
    comment: schemas.PostComment,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = (
            db.query(models.PostComment)
            .filter_by(user_id=user.get("user_id"), id=comment_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Comment not found")

        if not comment.content:
            raise HTTPException(status_code=400, detail="Content is required")

        query.content = comment.content
        db.commit()
        return {"message": "Comment updated successfully"}

    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/comment/delete/{comment_id}")
def delete_comment(
    comment_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        query = (
            db.query(models.PostComment)
            .filter_by(user_id=user.get("user_id"), id=comment_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Comment not found")
        db.delete(query)
        db.commit()
        return {"message": "Comment deleted successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tags", response_model=List[dict])
def get_tags(db: Session = Depends(get_db)):
    logger.info("get_tags")
    return [tag.to_json() for tag in db.query(models.PostTags).all()]


@router.get("/tag/{tag_id}")
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    try:
        query = db.query(models.PostTags).filter_by(id=tag_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        return query.to_json()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=str(e))


# Super user adds/edit/deletes tags and categories for now
# TODO: add editor status


@router.post("/tag/add")
def add_tag(
    tag: schemas.PostTag,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Superuser adds tags (TODO: add editor as well)
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        db_tag = models.PostTags(name=tag.name)
        db.add(db_tag)
        db.commit()
        return {"message": "Tag added successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/tag/edit/{tag_id}")
def edit_tag(
    tag_id: int,
    tag: schemas.PostTag,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = db.query(models.PostTags).filter_by(id=tag_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        query.name = tag.name
        db.commit()
        return {"message": "Tag edited successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/tag/delete/{tag_id}")
def delete_tag(
    tag_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        query = db.query(models.PostTags).filter_by(id=tag_id).one_or_none()
        if query is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        db.delete(query)
        db.commit()
        return {"message": "Tag deleted successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    return [
        category.to_json()
        for category in db.query(models.PostCategories).all()
    ]


@router.get("/category/{category_id}")
def get_category(category_id, db: Session = Depends(get_db)):
    try:
        query = (
            db.query(models.PostCategories)
            .filter_by(id=category_id)
            .one_or_none()
        )
        if query is None:
            raise HTTPException(status_code=404, detail="Category not found")
        return query.to_json()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/category/add")
def add_category(
    category: schemas.PostCategory,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        db_category = models.PostCategories(
            name=category.name, description=category.description
        )
        db.add(db_category)
        db.commit()
        return {"message": "Category added successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/category/edit/{category_id}")
def edit_category(
    category_id: int,
    category: schemas.PostCategory,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
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
        return {"message": "Category edited successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/category/delete/{category_id}")
def delete_category(
    category_id: int,
    user: HTTPAuthorizationCredentials = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    admin_status = (
        db.query(models.User)
        .filter_by(id=user.get("user_id"), is_superuser=True)
        .one_or_none()
    )
    if not admin_status:
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
        return {"message": "Category deleted successfully"}
    except Exception as e:
        logger.error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
