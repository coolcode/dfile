#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, escape, make_response, redirect, request, send_file, send_from_directory, url_for, Response, jsonify, render_template
from flask_script import Manager
from flask_cors import CORS
from humanize import naturalsize
import os, sys
import requests
from short_url import UrlEncoder
import ipfshttpclient
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')

manager = Manager(app)

su = UrlEncoder(alphabet='DEQhd2uFteibPwq0SWBInTpA_jcZL5GKz3YCR14Ulk87Jors9vNHgfaOmMXy6Vx-', block_size=16)


def dfile_url(scheme=None):
    return app.config['DOMAIN']
    if not scheme:
        return url_for(".dfile", _external=True).rstrip("/")
    else:
        return url_for(".dfile", _external=True, _scheme=scheme).rstrip("/")


def download(url):
    h = {"Accept-Encoding": "identity"}
    r = requests.get(url, stream=True, verify=False, headers=h)

    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return str(e) + "\n"

    if "content-length" in r.headers:
        l = int(r.headers["content-length"])

        if l < app.config["MAX_CONTENT_LENGTH"]:
            def urlfile(**kwargs):
                return type('', (), kwargs)()

            # f = urlfile(stream=r.raw, content_type=r.headers["content-type"], filename="")

            return send_file(r.raw, r.headers["content-type"])
        else:
            hl = naturalsize(l, binary=True)
            hml = naturalsize(app.config["MAX_CONTENT_LENGTH"], binary=True)

            return "Remote file too large ({0} > {1}).\n".format(hl, hml), 413
    else:
        return "Could not determine remote file size (no Content-Length in response header; shoot admin).\n", 411


@app.route("/<path:path>")
def get(path):
    p = os.path.splitext(path)
    hash = str(p[0])
    url = app.config['IPFS_FILE_URL'] + hash

    return download(url)


@app.route("/index", methods=["GET", "POST", "PUT"])
@app.route("/", methods=["GET", "POST", "PUT"])
def dfile():
    if request.method == "POST" or request.method == "PUT":
        print("files: {}".format(len(request.files)))
        if "file" in request.files:
            client = ipfshttpclient.connect(app.config['IPFS_CONNECT_URL'])
            res = client.add(request.files["file"])
            print("res: {}".format(res))
            # url = app.config['IPFS_FILE_URL'] + str(res['Hash'])
            url = dfile_url() + '/' + str(res['Hash'])
            return url

        abort(400)
    else:
        maxsize = naturalsize(app.config["MAX_CONTENT_LENGTH"], binary=True)
        return render_template("index.html", d={'url': dfile_url(), 'maxsize': maxsize})


@app.route("/robots.txt")
def robots():
    return """User-agent: *
Disallow: /
"""


def legal():
    return "451 Unavailable For Legal Reasons\n", 451


@app.errorhandler(400)
@app.errorhandler(404)
@app.errorhandler(414)
@app.errorhandler(415)
def segfault(e):
    return "Segmentation fault\n", e.code


@app.errorhandler(404)
@app.route('/404')
def notfound():
    return render_template('404.html', d={'pid': os.getpid(), 'id': id(app), 'path': escape(request.path)})


@manager.command
def debug():
    app.config["DFILE_USE_X_ACCEL_REDIRECT"] = False
    app.run(debug=True, port=4562, host="0.0.0.0")

#
# @manager.command
# def query(name):
#     id = su.debase(name)
#     f = File.query.get(id)
#
#     if f:
#         f.pprint()
#
#
# @manager.command
# def queryhash(h):
#     f = File.query.filter_by(hash=h).first()
#
#     if f:
#         f.pprint()


if __name__ == "__main__":
    manager.run()
