import datetime
import os
from minio import Minio
from minio.error import S3Error
from datetime import timedelta
from settings import MINIO_ACCESS_KEY, MINIO_SECRET_KEY, HOST_IP
from utils import logger


class MinioBucket:
    def __init__(self) -> None:
        self.storage_client()
        logger.info("Create MinioBucket")
        logger.info(HOST_IP)
        logger.info(self.client)

    def storage_client(self):
        self.client = Minio(
            f"{HOST_IP}:9000",
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=False
        )

    def generate_upload_signed_url(self, bucket_name, blob_name):
        logger.info("Generate upload signed url")
        logger.info(bucket_name)
        logger.info("=========  =========")
        found = self.client.bucket_exists(bucket_name)
        if not found:
            raise S3Error("Bucket not found")

        url = self.client.presigned_put_object(
            bucket_name,
            blob_name,
            expires=timedelta(minutes=15),
        )
        logger.info("URL")
        logger.info(url)
        logger.info("========= = =========")
        # url = "http://localhost:9000/" + url.split(":9000/")[1]
        return url

    def generate_download_signed_url(self, bucket_name, blob_name):
        url = self.client.presigned_get_object(
            bucket_name,
            blob_name,
            expires=timedelta(minutes=15),
        )

        return url

    def list_blobs(self, bucket_name, folder):
        objects = self.client.list_objects(bucket_name, prefix=folder, recursive=True)
        return [obj.object_name for obj in objects]
