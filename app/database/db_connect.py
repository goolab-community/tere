import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from settings import DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_CONNECTION_TYPE


if DB_CONNECTION_TYPE == "local":
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
else:
    SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?host=/cloudsql/{DB_HOST}&port={DB_PORT}"

print("=========================================")
print("DB_CONNECTION_TYPE: ", DB_CONNECTION_TYPE)
print(SQLALCHEMY_DATABASE_URL)
print("=========================================")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
