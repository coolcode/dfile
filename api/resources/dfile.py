from flask import request, jsonify, redirect
from ..yopo.app_context import app_context
from ..services import S3
from ..models import File

app = app_context(__name__)

MAXIMUM_REQUEST_SIZE = 100 * 1024 * 1024  # 100M
BUCKET_NAME = 'dfile'


@app.route("/", methods=["POST"])
# @app.route("/up", methods=["POST"])
def up():
    if "file" not in request.files:
        return 'file not foud.', 400

    file = request.files["file"]
    if request.content_length:
        if request.content_length >= 1024 * 1024:
            r = round(request.content_length / (1024 * 1024), 1)
            req_size = f'{r} mb'
        elif request.content_length >= 1024:
            r = round(request.content_length / 1024)
            req_size = f'{r} kb'
        else:
            req_size = f'{request.content_length} b'

        app.log.info(f"file name: {file.filename}, req size: {req_size}", {'app': 'dfile-up-req'})
        if request.content_length > MAXIMUM_REQUEST_SIZE:
            return 'request length limited.', 400

    app.log.info(f"file name: {file.filename}", {'app': 'dfile-up-req'})

    s3 = S3(app.config, app.log)
    res = s3.upload_file(file, BUCKET_NAME)

    app.log.info(f"upload res: {res}", {'app': 'dfile-up-res'})
    if not res['hash']:
        return res['error'], 503
    else:
        f = File()
        # f.id = res['hash']
        f.slug = str(res['hash'])
        f.filename = file.filename
        f.path = res['oname']
        f.size = request.content_length or 0
        f.dl_num = 0
        r = f.save()
        app.log.info(f"save res: {r}")

    url = f"{app.config['DOMAIN']}/{res['oname']}"
    return url


@app.route("/<path:path>", methods=["GET"])
# @app.route("/down/<path:path>", methods=["GET"])
def down(path):
    if not path:
        return "DFile API v1.20.0505. Github: https://github.com/coolcode/dfile", 200

    app.log.info(f"path: {path}", {'app': 'dfile-down-req'})

    url = f"{app.config['S3_ENDPOINT']}/{BUCKET_NAME}/{path}"

    return redirect(url, code=302)


@app.route("/stat", methods=["GET"])
def stat():
    file_count = 13232
    return {'file_count': file_count}, 200
