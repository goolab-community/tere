from pydantic import BaseModel


class User(BaseModel):
    username: str = None  # Make the username field optional
    email: str
    password: str
