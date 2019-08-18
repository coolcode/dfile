#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, abort, escape, make_response, redirect, request, send_file, send_from_directory, url_for, Response, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
#from hashlib import sha256
from humanize import naturalsize
# from magic import Magic
# from mimetypes import guess_extension
import os, sys
import requests
from short_url import UrlEncoder
# from validators import url as url_valid
import ipfshttpclient
from datetime import datetime

app = Flask(__name__)
app.config.from_pyfile('config.py')

# if app.config["NSFW_DETECT"]:
#     from nsfw_detect import NSFWDetector
#
#     nsfw = NSFWDetector()
#
# try:
#     mimedetect = Magic(mime=True, mime_encoding=False)
# except:
#     print("""Error: You have installed the wrong version of the 'magic' module.
# Please install python-magic.""")
#     sys.exit(1)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command("db", MigrateCommand)

su = UrlEncoder(alphabet='DEQhd2uFteibPwq0SWBInTpA_jcZL5GKz3YCR14Ulk87Jors9vNHgfaOmMXy6Vx-', block_size=16)


#
#
# class URL(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     url = db.Column(db.UnicodeText, unique=True)
#
#     def __init__(self, url):
#         self.url = url
#
#     def getname(self):
#         return su.enbase(self.id, 1)
#
#     def geturl(self):
#         return url_for("get", path=self.getname(), _external=True) + "\n"


class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hash = db.Column(db.String(50), unique=True)
    time = db.Column(db.DateTime)

    def __init__(self, hash):
        self.hash = hash
        self.time = datetime.now()


def fhost_url(scheme=None):
    if not scheme:
        return url_for(".fhost", _external=True).rstrip("/")
    else:
        return url_for(".fhost", _external=True, _scheme=scheme).rstrip("/")


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

            f = urlfile(stream=r.raw, content_type=r.headers["content-type"], filename="")

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
    # id = su.debase(p[0])
    #
    # print("p: {}".format(p))
    # print("id: {}".format(id))
    #
    # if p[1]:
    #
    #     f = File.query.get(id)
    #
    #     if f and f.ext == p[1]:
    #         if f.removed:
    #             return legal()
    #
    #         fpath = getpath(f.sha256)
    #
    #         if not os.path.exists(fpath):
    #             abort(404)
    #
    #         fsize = os.path.getsize(fpath)
    #
    #         if app.config["FHOST_USE_X_ACCEL_REDIRECT"]:
    #             response = make_response()
    #             response.headers["Content-Type"] = f.mime
    #             response.headers["Content-Length"] = fsize
    #             response.headers["X-Accel-Redirect"] = "/" + fpath
    #             return response
    #         else:
    #             return send_from_directory(app.config["FHOST_STORAGE_PATH"], f.sha256, mimetype=f.mime)
    # else:
        # client = ipfshttpclient.connect('/ip4/3.84.136.87/tcp/5001/http')
        # print("p0: {}".format(p[0]))
        # res = client.get(p[0])
        # print("res get : {}".format(res))
        # res1 = client.cat(p[0])
        # print("res cat : {}".format(res1))
        # res2 = client.object.get(p[0])
        # print("res object.get : {}".format(res2))
    hash = str(p[0])
    url = app.config['IPFS_FILE_URL'] + hash
    return download(url)

    #abort(404)


@app.route("/index", methods=["GET", "POST", "PUT"])
@app.route("/", methods=["GET", "POST", "PUT"])
def fhost():
    if request.method == "POST" or request.method == "PUT":
        sf = None
        print("files: {}".format(len(request.files)))
        if "file" in request.files:
            client = ipfshttpclient.connect(app.config['IPFS_CONNECT_URL'])
            res = client.add(request.files["file"])
            print("res: {}".format(res))
            # url = app.config['IPFS_FILE_URL'] + str(res['Hash'])
            url = fhost_url() + '/' + str(res['Hash'])
            return url
            # return store_file(request.files["file"], request.remote_addr)
        # elif "url" in request.form:
        #     return store_url(request.form["url"], request.remote_addr)
        # elif "shorten" in request.form:
        #     return shorten(request.form["shorten"])

        abort(400)
    else:
        # fmts = list(app.config["FHOST_EXT_OVERRIDE"])
        # fmts.sort()
        maxsize = naturalsize(app.config["MAX_CONTENT_LENGTH"], binary=True)
        # maxsizenum, maxsizeunit = maxsize.split(" ")
        # maxsizenum = float(maxsizenum)
        # maxsizehalf = maxsizenum / 2
        #
        # if maxsizenum.is_integer():
        #     maxsizenum = int(maxsizenum)
        # if maxsizehalf.is_integer():
        #     maxsizehalf = int(maxsizehalf)
        return render_template("index.html", d={'url': fhost_url(), 'maxsize': maxsize})


#         return """
# """.format(fhost_url(),
#            maxsize, str(maxsizehalf).rjust(27), str(maxsizenum).rjust(27),
#            maxsizeunit.rjust(54),
#            ", ".join(app.config["FHOST_MIME_BLACKLIST"]))


@app.route("/robots.txt")
def robots():
    return """User-agent: *
Disallow: /
"""


# @app.route("/dump_urls/")
# @app.route("/dump_urls/<int:start>")
# def dump_urls(start=0):
#     meta = "#FORMAT: BEACON\n#PREFIX: {}/\n\n".format(fhost_url("https"))
#
#     def gen():
#         yield meta
#
#         for url in URL.query.order_by(URL.id.asc()).offset(start):
#             if url.url.startswith("http") or url.url.startswith("https"):
#                 bar = "|"
#             else:
#                 bar = "||"
#
#             yield url.getname() + bar + url.url + "\n"
#
#     return Response(gen(), mimetype="text/plain")


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
    app.config["FHOST_USE_X_ACCEL_REDIRECT"] = False
    app.run(debug=True, port=4562, host="0.0.0.0")


@manager.command
def query(name):
    id = su.debase(name)
    f = File.query.get(id)

    if f:
        f.pprint()


@manager.command
def queryhash(h):
    f = File.query.filter_by(hash=h).first()

    if f:
        f.pprint()


if __name__ == "__main__":
    manager.run()
