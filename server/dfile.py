#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, request
from flask_script import Manager
from flask_cors import CORS
import os
import logging
from logdna import LogDNAHandler
import boto3
from botocore.exceptions import ClientError
from ipfs import ipfs_hash

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')

manager = Manager(app)

logdna_key = app.config['LOGDNA_KEY']
log = logging.getLogger('logdna')
log.setLevel(logging.INFO)

options = {
    'hostname': 'dapp',
    'ip': '127.0.0.1',
    'index_meta': True
}

console = logging.StreamHandler()
root = logging.getLogger('')
root.addHandler(console)
if logdna_key != "":
    root.addHandler(LogDNAHandler(logdna_key, options))


def upload_file(file, bucket='dfile', object_name=None):
    """Upload a file to an S3 bucket

    :param file: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file
    try:
        file_name = file.filename
        log.info('content_type: {}'.format(file.content_type))
        bytes = file.read()
        hash = ipfs_hash(bytes)
        name, ext = os.path.splitext(file_name)
        log.info('hash: {}, ext: {}'.format(hash, ext))

        # If S3 object_name was not specified, use ipfs hash
        if object_name is None:
            object_name = '{}{}'.format(hash, ext)

        session = boto3.session.Session()
        client = session.client('s3',
                                region_name=app.config['S3_REGION'],
                                endpoint_url=app.config['S3_ENDPOINT'],
                                aws_access_key_id=app.config['S3_KEY'],
                                aws_secret_access_key=app.config['S3_SECRET'])
        file.seek(0, 0)
        # https://boto3.amazonaws.com/v1/documentation/api/latest/reference/customizations/s3.html#boto3.s3.transfer.S3Transfer.ALLOWED_UPLOAD_ARGS
        # ExtraArgs:['ACL', 'CacheControl', 'ContentDisposition', 'ContentEncoding', 'ContentLanguage', 'ContentType', 'Expires', 'GrantFullControl',
        # 'GrantRead', 'GrantReadACP', 'GrantWriteACP', 'Metadata', 'RequestPayer', 'ServerSideEncryption', 'StorageClass', 'SSECustomerAlgorithm',
        # 'SSECustomerKey', 'SSECustomerKeyMD5', 'SSEKMSKeyId', 'WebsiteRedirectLocation']
        extra_args = {'ACL': 'public-read', 'ContentType': file.content_type, 'Metadata': {'name': file_name}}
        response = client.upload_fileobj(file, bucket, object_name, ExtraArgs=extra_args)
        # log.info('res: {}'.format(response))
        return {'hash': object_name}
    except ClientError as e:
        log.exception("S3 Client Error! file name:{0}, exception:{1}".format(file.filename, str(e)))
        return {'hash': '', 'error': "S3 Client Error! \n"}
    except Exception as e:
        log.exception("S3 Upload Error! file name:{0}, exception:{1}".format(file.filename, str(e)))
        return {'hash': '', 'error': "S3 Upload Error! \n"}


@app.route("/", methods=["POST", "PUT"])
@app.route("/up", methods=["POST", "PUT"])
def up():
    try:
        if "file" in request.files:
            file = request.files["file"]

            log.info("file name: {}".format(file.filename), {'app': 'dfile-up-req'})

            res = upload_file(file)

            log.info("upload res: {}".format(res), {'app': 'dfile-up-res'})
            if not res['hash']:
                return res['error']

            url = app.config['DOMAIN'] + '/' + str(res['hash'])
            return url

        abort(400)

    except Exception as e:
        log.exception("Upload Error! exception:{}".format(str(e)))
        return "Upload Error! \n", 503


@app.route("/<path:path>")
@app.route("/down/<path:path>")
def down(path):
    try:
        log.info("path:{0}".format(path), {'app': 'dfile-down-req'})
        p = os.path.splitext(path)
        hash = str(p[0])

        if not hash:
            return "<Invalid Path>", 404

        log.info("hash:{0}".format(hash), {'app': 'dfile-down-req'})

        return hash
    except Exception as e:
        log.exception("Download Error! path:{0}, exception:{1}".format(path, str(e)))
        return "Download Error! \n", 503


def legal():
    return "451 Unavailable For Legal Reasons\n", 451


@manager.command
def debug():
    app.run(debug=True, port=5000, host="0.0.0.0")
    log.info("DFile is debugging.")


if __name__ == "__main__":
    manager.run()
    log.info("DFile is running.")
