import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from settings import DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT


# SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# parameters = {
#     "drivername": "postgresql+psycopg2",
#     "username": DB_USER,
#     "password": DB_PASSWORD,
#     "host": DB_HOST,
#     "port": DB_PORT,
#     "database": DB_NAME,
# }

# print("=========================================")
# print(SQLALCHEMY_DATABASE_URL)
# print("=========================================")

# if INSTANCE_CONNECTION_NAME and DB_CONNECTION_TYPE != "local":
#     parameters["query"] = {"host": "{}/{}".format("/cloudsql", INSTANCE_CONNECTION_NAME)}

SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?host=/cloudsql/{DB_HOST}&port={DB_PORT}"

# database_url = sqlalchemy.engine.url.URL.create(**parameters)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
