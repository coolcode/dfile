#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, request, send_file
from flask_script import Manager
from flask_cors import CORS
import os
import requests
import logging
from logdna import LogDNAHandler
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from ipfs import encode
from io import BytesIO

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
        # If S3 object_name was not specified, use file_name
        file_name = file.filename
        if object_name is None:
            object_name = file_name
        log.info('content_type: {}'.format(file.content_type))
        bytes = file.read()
        hash = encode(bytes)
        name, ext = os.path.splitext(file_name)
        log.info('hash: {}, ext: {}'.format(hash, ext))

        if object_name is None:
            # object_name = file_name
            object_name = '{}{}'.format(hash, ext)

        session = boto3.session.Session()
        client = session.client('s3',
                                region_name=app.config['S3_REGION'],
                                endpoint_url=app.config['S3_ENDPOINT'],
                                aws_access_key_id=app.config['S3_KEY'],
                                aws_secret_access_key=app.config['S3_SECRET'])
        file.seek(0,0)
        x = file.read()
        print("x: {}".format(len(x)))
        response = client.upload_fileobj(BytesIO(bytes), bucket, object_name, ExtraArgs={'ACL': 'public-read', 'ContentType': file.content_type})
        log.info('res: {}'.format(response))
        return response
    except ClientError as e:
        log.exception("S3 Client Error! file name:{0}, exception:{1}".format(file.filename, str(e)))
        return "S3 Client Error! \n"
    except Exception as e:
        log.exception("S3 Upload Error! file name:{0}, exception:{1}".format(file.filename, str(e)))
        return "S3 Upload Error! \n"


def download(url):
    h = {"Accept-Encoding": "identity"}
    r = requests.get(url, stream=True, verify=False, headers=h)

    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        log.exception("IPFS Server Error! url:{0}, exception:{1}".format(url, str(e)))
        return "IPFS Server Error! \n", 503

    if "content-type" in r.headers:
        return send_file(r.raw, r.headers["content-type"])
    else:
        return send_file(r.raw)


def upload(url, file):
    h = {"Accept-Encoding": "identity"}
    d = {"path": file}
    r = requests.post(url, files=d, stream=True, verify=False, headers=h)

    try:
        r.raise_for_status()
        return r.json()
    except requests.exceptions.HTTPError as e:
        log.exception("Upload Error! file name:{0}, exception:{1}".format(file.filename, str(e)))
        return "IPFS Upload Error! \n"


@app.route("/<path:path>")
@app.route("/down/<path:path>")
def down(path):
    try:
        p = os.path.splitext(path)
        hash = str(p[0])

        if not hash or not hash.startswith('Qm'):
            return "<Invalid Path>", 404

        log.info("hash:{0}".format(hash), {'app': 'dfile-down-req'})

        if 'IPFS_API_URL' in app.config:
            url = app.config['IPFS_API_URL'] + '/cat/' + hash
        else:
            url = app.config['IPFS_FILE_URL'] + hash

        return download(url)
    except Exception as e:
        log.exception("Download Error! path:{0}, exception:{1}".format(path, str(e)))
        return "Download Error! \n", 503


@app.route("/", methods=["POST", "PUT"])
@app.route("/up", methods=["POST", "PUT"])
def up():
    try:
        if "file" in request.files:
            file = request.files["file"]

            log.info("file name: {}".format(file.filename), {'app': 'dfile-up-req'})

            res = upload_file(file)

            log.info("upload res: {}".format(res), {'app': 'dfile-up-res'})
            url = app.config['DOMAIN']  # + '/' + str(res['Hash'])
            return url

        abort(400)

    except Exception as e:
        log.exception("Upload Error! exception:{}".format(str(e)))
    return "Upload Error! \n", 503


def legal():
    return "451 Unavailable For Legal Reasons\n", 451


# @app.errorhandler(400)
# @app.errorhandler(404)
# @app.errorhandler(414)
# @app.errorhandler(415)
# def segfault(e):
#     return "Segmentation fault\n", e.code
#

@manager.command
def debug():
    app.run(debug=True, port=5000, host="0.0.0.0")
    log.info("DFile is debugging.")


if __name__ == "__main__":
    manager.run()
    log.info("DFile is running.")
