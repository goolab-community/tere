#!/bin/env python3
# -*- coding: utf-8 -*-
"""
Select animals from mysql database, iterate over them, check
it animal health state is is not updated more than a week increment health status
by one, it health state is less than 0, set it to -1 and mark animal as ghost.
"""
import os
import sys
import time
import logging
import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from models import Animal


period = 60 * 60 * 24  # 1 day
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("scheduler.log"),
        logging.StreamHandler(sys.stdout)
    ]
)


while True:
    try:
        # Load environment variables from .env file
        load_dotenv()
        logging.info("Loading environment variables...")
        # Get database connection parameters from environment variables
        db_host = os.getenv("DB_HOST")
        db_user = os.getenv("DB_USER")
        db_password = os.getenv("DB_PASSWORD")
        db_name = os.getenv("DB_NAME")
        DB_CONNECTION_TYPE = os.getenv("DB_CONNECTION_TYPE", "local")

        logging.info("Connecting to database...")
        # Check if environment variables are set
        if not all([db_host, db_user, db_password, db_name]):
            logging.error("Missing database connection parameters.")
            sys.exit(1)
        logging.info("Database connection parameters loaded successfully.")

        if DB_CONNECTION_TYPE == "local":
            SQLALCHEMY_DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}/{db_name}"
        else:
            SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{db_user}:{db_password}@/{db_name}?host={db_host}"

        logging.info(SQLALCHEMY_DATABASE_URL)
        # Create a new SQLAlchemy engine instance
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        logging.info("-------- 2222 --------")
        # Create a new session
        Session = sessionmaker(bind=engine)
        session = Session()
        # query animals, with sqlalchemy ORM
        query = session.query(Animal).filter(Animal.overall_health != -1)
        animals = query.all()
        logging.info(f"Animals: {animals}")
        # iterate over animals
        for animal in animals:
            # check if animal health state is not updated more than a week
            logging.info(f"Animal: {animal.id}, Health State: {animal.overall_health}, Updated At: {animal.updated_at}")
            if True or animal.updated_at < (datetime.datetime.now() - datetime.timedelta(days=7)):
                if animal.overall_health == 0 or animal.overall_health is None:
                    # animal is a ghost
                    animal.overall_health = -1
                    logging.info(f"{animal.id} Animal is a ghost")
                else:
                    # increment health status by one
                    animal.overall_health -= 1
                    logging.info(f"{animal.id} Animal health state decremented to")

        session.commit()
        # close session
        session.close()

    except SQLAlchemyError as e:
        logging.info(f"SQLAlchemyError: {e}")
    finally:
        time.sleep(period)
        # close session
        session.close()
