import boto3
import datetime
from botocore.exceptions import ClientError
import urllib
import time
import os
from .util import snowflake_id

from logging import getLogger

log = getLogger(__name__)

measurable_metrics = [
    ('BucketSizeBytes', 'StandardStorage', 'Megabytes'),
    ('NumberOfObjects', 'AllStorageTypes', 'Count'), 
]


class S3:
    def __init__(self, conf, log):
        session = boto3.session.Session()
        self.s3 = session.client('s3',
                                region_name=conf['S3_REGION'],
                                endpoint_url=conf['S3_ENDPOINT'],
                                aws_access_key_id=conf['S3_KEY'],
                                aws_secret_access_key=conf['S3_SECRET'])
        self.log = log
    

    def upload_file(self, file, bucket='files', object_name=None):
        """Upload a file to an S3 bucket

        :param file: File to upload
        :param bucket: Bucket to upload to
        :param object_name: S3 object name. If not specified then filename is used
        :return: True if file was uploaded, else False
        """

        # Upload the file
        filename = file.filename
        try:
            start = time.perf_counter()
            print(f'content_type: {file.content_type}')
            # bytes = file.read()
            hash = snowflake_id() 
            name, ext = os.path.splitext(filename)
            print(f'hash: {hash}, ext: {ext}')

            # If S3 object_name was not specified, use hash
            if object_name is None:
                object_name = f'{hash}{ext}'

            file.seek(0, 0)
            # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/customizations/s3.html#boto3.s3.transfer.S3Transfer.ALLOWED_UPLOAD_ARGS
            # ExtraArgs:['ACL', 'CacheControl', 'ContentDisposition', 'ContentEncoding', 'ContentLanguage', 'ContentType', 'Expires', 'GrantFullControl',
            # 'GrantRead', 'GrantReadACP', 'GrantWriteACP', 'Metadata', 'RequestPayer', 'ServerSideEncryption', 'StorageClass', 'SSECustomerAlgorithm',
            # 'SSECustomerKey', 'SSECustomerKeyMD5', 'SSEKMSKeyId', 'WebsiteRedirectLocation']
            extra_args = {'ACL': 'public-read', 'ContentType': file.content_type, 'Metadata': {'name': urllib.parse.quote(filename, safe='')}}
            start2 = time.time()
            response = self.s3.upload_fileobj(file, bucket, object_name, ExtraArgs=extra_args)
            span = round(time.perf_counter() - start, 2)
            self.log.info(f"s3 upload: {span}s")
            return {'hash': object_name}
        except ClientError as e:
            self.log.exception(f"S3 Client Error! file name:{filename}, exception:{e}")
            return {'hash': '', 'error': "S3 Client Error! \n"}
        except Exception as e:
            self.log.exception(f"S3 Upload Error! file name:{filename}, exception:{e}")
            return {'hash': '', 'error': "S3 Upload Error! \n"}
