import datetime
import os
from minio import Minio
from minio.error import S3Error
from datetime import timedelta
from settings import MINIO_ADDRESS, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, HOST_IP


def storage_client():
    return Minio(
        f"{HOST_IP}:9000",
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )


def generate_upload_signed_url(bucket_name, blob_name):
    client = storage_client()
    found = client.bucket_exists(bucket_name)
    if not found:
        raise S3Error("Bucket not found")

    url = client.presigned_put_object(
        bucket_name,
        blob_name,
        expires=timedelta(minutes=15),
    )

    return url


def generate_download_signed_url(bucket_name, blob_name):
    client = storage_client()

    url = client.presigned_get_object(
        bucket_name,
        blob_name,
        expires=timedelta(minutes=15),
    )

    return url


def list_blobs(bucket_name, folder):
    """Lists all the objects in the bucket with an optional prefix filter."""

    # Create a MinIO client instance
    client = storage_client()

    # List objects in the specified bucket with an optional prefix
    objects = client.list_objects(bucket_name, prefix=folder, recursive=True)
    return [obj.object_name for obj in objects]
