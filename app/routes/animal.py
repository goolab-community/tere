from fastapi import FastAPI, Depends, HTTPException, APIRouter, status
from fastapi.middleware.cors import CORSMiddleware
# from pymongo import MongoClient
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils import logger
from database import Base, engine
import schemas
import models
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_, and_
from pydantic import parse_obj_as
from utils import (
    generate_token,
    verify_password,
    get_password_hash,
    verify_token,
    security,
    get_current_user
)
# from typing import Annotated
from settings import BASE_URL
from gcp import generate_upload_signed_url_v4, generate_download_signed_url_v4
from datetime import datetime


router = APIRouter(
    prefix=f"{BASE_URL}/animal",
    tags=["Animal"],
)


@router.get("/animal")
def animal(db: Session = Depends(get_db),
           animal_id: int = None):
    try:
        if animal_id:
            animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
            if animal:
                return animal.to_json()
            else:
                return {
                    "message": "Animal not found"
                }
        else:
            return {
                "message": "Animal ID is required"
            }
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/animals")
def animals(db: Session = Depends(get_db)):
    # pagination and search query
    animals = db.query(models.Animal).all()
    return animals


@router.get("/animals_paginated")
def animals_paginated(user: HTTPAuthorizationCredentials = Depends(get_current_user),
                      offset: int = 0,
                      limit: int = 10,
                      search: str = None,
                      order_by: str = "id",
                      dir: str = "asc",
                      db: Session = Depends(get_db)):
    # pagination and search query
    # animals = db.query(models.Animal).all()
    default_resp = {
        "data": [],
        "count": 0
    }
    try:
        if search is None:
            query = db.query(models.Animal)
        else:
            query = db.query(models.Animal).filter(or_(
                models.Animal.tag_id.ilike(f"%{search}%"),
                models.Animal.rfid_code.ilike(f"%{search}%"),
                models.Animal.name.ilike(f"%{search}%"),
                models.Animal.description.ilike(f"%{search}%"),
                models.Animal.address.ilike(f"%{search}%")
            ))
        query = query.order_by(
            getattr(models.Animal, order_by).asc() if dir == "asc" else getattr(models.Animal, order_by).desc()
        )
        count = query.count()
        query = query.offset(offset).limit(limit).all()
    except SQLAlchemyError as e:
        logger.error(e)
        return default_resp, status.HTTP_500_INTERNAL_SERVER_ERROR
    return {
        "data": [animal.to_json() for animal in query],
        "count": count
    }


@router.get("/animals_open")
def animals_open(db: Session = Depends(get_db)):
    return db.query(models.Animal).all()


# Animal model CRUD
@router.post("/create", response_model=dict)
def create_animal(animal: schemas.Animal,
                  user: HTTPAuthorizationCredentials = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    try:
        # logger.info((animal.species, animal.sex))
        # logger.info(user)
        new_animal = models.Animal(
            species=animal.species,
            sex=animal.sex,
            breed_id=None,  # animal.breed_id,
            tag_id=animal.tag_id,
            rfid_code=animal.rfid_code,
            age_year=animal.age_year,
            age_month=animal.age_month,
            age_year_from=animal.age_year_from,
            age_month_from=animal.age_month_from,
            age_year_to=animal.age_year_to,
            age_month_to=animal.age_month_to,
            name=animal.name,
            description=animal.description,
            latitude=animal.latitude,
            longitude=animal.longitude,
            address=animal.address
        )
        db.add(new_animal)
        db.commit()
        image_media = models.Media(
            url=f"icons/animal_main_image_{new_animal.id}.jpg",
            type="icon",
            uploaded_by_user_id=user.get("user_id"),
            date=datetime.now(),
            animal_id=new_animal.id
        )
        icon_media = models.Media(
            url=f"images/animal_main_image_{new_animal.id}.jpg",
            type="image",
            uploaded_by_user_id=user.get("user_id"),
            date=datetime.now(),
            animal_id=new_animal.id
        )
        db.add(image_media)
        db.add(icon_media)
        db.commit()
        url = generate_upload_signed_url_v4("tere-media-bucket", f"images/animal_main_image_{new_animal.id}.jpg")
        url_icon = generate_upload_signed_url_v4("tere-media-bucket", f"icons/animal_main_image_{new_animal.id}.jpg")
        return {
            "animal": new_animal.to_json(),
            "message": "Animal created successfully",
            "upload_url":  url,
            "upload_url_icon": url_icon
        }
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/delete/{animal_id}", response_model=dict)
def delete_animal(animal_id: int, user: HTTPAuthorizationCredentials = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    try:
        if user.get("is_superuser"):
            animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
        if animal:
            db.delete(animal)
            db.commit()
            return {
                "message": "Animal deleted successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="Animal not found")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/read/{animal_id}", response_model=dict)
def read_animal(animal_id: int, db: Session = Depends(get_db)):
    animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
    if animal:
        return {
            "animal": animal.to_json()
        }
    else:
        raise HTTPException(status_code=404, detail="Animal not found")


@router.put("/update/{animal_id}", response_model=dict)
def update_animal(animal_id: int, animal: schemas.Animal, 
                  user: HTTPAuthorizationCredentials = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    try:
        for user_animal in user.animals:
            if user_animal.id == animal_id:
                break
        # db_animal = db.query(models.Animal).filter(models.Animal.id == animal_id).first()
        if user_animal:
            user_animal.species = animal.species
            user_animal.sex = animal.sex
            user_animal.breed_id = animal.breed_id
            user_animal.tag_id = animal.tag_id
            user_animal.rfid_code = animal.rfid_code
            user_animal.age_year = animal.age_year
            user_animal.age_month = animal.age_month
            user_animal.age_year_from = animal.age_year_from
            user_animal.age_month_from = animal.age_month_from
            user_animal.age_year_to = animal.age_year_to
            user_animal.age_month_to = animal.age_month_to
            user_animal.name = animal.name
            user_animal.description = animal.description
            user_animal.latitude = animal.latitude
            user_animal.longitude = animal.longitude
            user_animal.address = animal.address
            db.commit()
            return {
                "animal": user_animal.to_json()
            }
        else:
            raise HTTPException(status_code=404, detail="Animal not found")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/update_icon/{animal_id}", response_model=dict)
def update_icon(animal_id: int, media_id: int, user: HTTPAuthorizationCredentials = Depends(get_current_user),
                db: Session = Depends(get_db)):
    try:
        for animal in user.animals:
            if animal.id == animal_id:
                break
        if animal:
            db_media = db.query(models.Media).filter(and_(
                models.Media.id == media_id,
                models.Media.type == "icon"
                )).first()
            if db_media:
                image_index = None
                for i, m in enumerate(animal.medias):
                    if m.type == "icon":
                        image_index = i
                if image_index is not None:
                    animal.medias.pop(image_index)
                    animal.medias.append(db_media)
                db.commit()
                return {
                    "media": db_media.to_json()
                }
            else:
                raise HTTPException(status_code=404, detail="Media not found")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/media/{media_id}", response_model=dict)
def read_media(media_id: int, db: Session = Depends(get_db)):
    media = db.query(models.Media).filter(models.Media.id == media_id).first()
    if media:
        try:
            url = generate_download_signed_url_v4("tere-media-bucket", media.url)
        except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=404, detail="Media not found")
        return {
            "media": {
                "url": url,
            }
        }
    else:
        raise HTTPException(status_code=404, detail="Media not found")


@router.post("/media/{animal_id}", response_model=dict)
def create_media(animal_id: int, media: schemas.Media, user: HTTPAuthorizationCredentials = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    try:
        for animal in user.animals:
            if animal.id == animal_id:
                break
        if animal:
            new_media = models.Media(
                url=media.url,
                type=media.type,
                uploaded_by_user_id=user.get("user_id"),
                date=datetime.now(),
                animal_id=animal_id
            )
            db.add(new_media)
            db.commit()
            return {
                "media": new_media.to_json()
            }
        else:
            raise HTTPException(status_code=404, detail="Animal not found")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")