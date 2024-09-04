import datetime
import os
from google.cloud import storage
from google.oauth2.service_account import Credentials
import json


class GCPBucket:

    def __init__(self) -> None:
        self.storage_client()

    def storage_client(self):
        if os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
            self.client = storage.Client()
        else:
            # Load the manually downloaded credentials
            service_account_info = json.loads(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON"))
            credentials = Credentials.from_service_account_info(service_account_info)
            # Initialize the Google Cloud Storage client with the manually loaded credentials
            self.client = storage.Client(credentials=credentials)

    def generate_upload_signed_url(self, bucket_name, blob_name):
        """Generates a v4 signed URL for uploading a blob using HTTP PUT.

        Note that this method requires a service account key file. You can not use
        this if you are using Application Default Credentials from Google Compute
        Engine or from the Google Cloud SDK.
        """
        bucket = self.client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        url = blob.generate_signed_url(
            version="v4",
            # This URL is valid for 15 minutes
            expiration=datetime.timedelta(minutes=15),
            # Allow PUT requests using this URL.
            method="PUT",
            content_type="application/octet-stream",
        )
        return url

    def generate_download_signed_url(self, bucket_name, blob_name):
        """Generates a v4 signed URL for downloading a blob.

        Note that this method requires a service account key file. You can not use
        this if you are using Application Default Credentials from Google Compute
        Engine or from the Google Cloud SDK.
        """
        bucket = self.client.bucket(bucket_name)
        blob = bucket.blob(blob_name)

        url = blob.generate_signed_url(
            version="v4",
            # This URL is valid for 15 minutes
            expiration=datetime.timedelta(minutes=15),
            # Allow GET requests using this URL.
            method="GET",
        )
        return url

    def list_blobs(self, bucket_name, folder):
        """Lists all the blobs in the bucket."""
        bucket = self.client.bucket(bucket_name)

        blobs = bucket.list_blobs(prefix=folder)
        return [blob.name for blob in blobs]
