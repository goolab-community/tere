from settings import DEV_TYPE
from .minio import MinioBucket
from .gcp import GCPBucket


if DEV_TYPE == "local":
    Bucket = MinioBucket
else:
    Bucket = GCPBucket
