#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, request, send_file, render_template
from flask_script import Manager
from flask_cors import CORS
import os
import requests
import ipfshttpclient

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')

manager = Manager(app)


def download(url):
    h = {"Accept-Encoding": "identity"}
    r = requests.get(url, stream=True, verify=False, headers=h)

    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        # TODO: log
        return "IPFS Server Error! \n"

    if "content-type" in r.headers:
        return send_file(r.raw, r.headers["content-type"])
    else:
        return send_file(r.raw)


@app.route("/<path:path>")
@app.route("/down/<path:path>")
def down(path):
    try:
        p = os.path.splitext(path)
        print(p)
        hash = str(p[0])
        url = app.config['IPFS_FILE_URL'] + hash

        return download(url)
    except Exception as e:
        # TODO:log
        return "Download Error! \n"


@app.route("/", methods=["GET", "POST", "PUT"])
@app.route("/up", methods=["POST", "PUT"])
def up():
    if request.method == "POST" or request.method == "PUT":
        print("files: {}".format(len(request.files)))
        if "file" in request.files:
            client = ipfshttpclient.connect(app.config['IPFS_CONNECT_URL'])
            res = client.add(request.files["file"])
            print("res: {}".format(res))
            # url = app.config['IPFS_FILE_URL'] + str(res['Hash'])
            url = app.config['DOMAIN'] + '/down/' + str(res['Hash'])
            return url

        abort(400)
    else:
        return render_template("index.html")


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
    app.run(debug=True, port=4562, host="0.0.0.0")


if __name__ == "__main__":
    manager.run()
