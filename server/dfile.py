#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, request, send_file
from flask_script import Manager
from flask_cors import CORS
import os
import requests
import ipfshttpclient
import logging
from logdna import LogDNAHandler

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
            if 'IPFS_API_URL' in app.config:
                url = app.config['IPFS_API_URL'] + '/add'
                res = upload(url, file)
            else:
                client = ipfshttpclient.connect(app.config['IPFS_CONNECT_URL'])
                res = client.add(file)
                print("res: {}".format(res))

            log.info("upload res: {}".format(res), {'app': 'dfile-up-res'})
            url = app.config['DOMAIN'] + '/' + str(res['Hash'])
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
