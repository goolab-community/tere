from jwt import encode as jwt_encode


SECRET_KEY = "OF very strong secret!"


def generate_token(email: str) -> str:
    payload = {"email": email}
    token = jwt_encode(payload, SECRET_KEY, algorithm="HS256")
    return token
