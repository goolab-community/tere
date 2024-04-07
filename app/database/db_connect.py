from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from settings import DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT


SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# print("=========================================")
# print(SQLALCHEMY_DATABASE_URL)
# print("=========================================")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
