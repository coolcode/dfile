from flask import request, jsonify, redirect
from datetime import datetime as dt
import os
from ..yopo.app_context import app_context
from ..services import S3, ipfs_hash, shorty
from ..models import db, File

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
            app.log.warning(f"file name: {file.filename}, excel maximum request size", {'app': 'dfile-up-req'})
            return 'request length limited.', 400
    else:
        app.log.info(f"file name: {file.filename}, empty request", {'app': 'dfile-up-req'})
        return 'empty request.', 400

    ok, file_hash, err = __read_file_hash(file)
    if not ok and err == 'empty':
        app.log.info(f"file name: {file.filename}, empty file", {'app': 'dfile-up-req'})
        return 'empty file.', 400

    if file_hash:
        f = db.session.query(File.filename, File.path).filter_by(hash=file_hash).first()
        if f:
            app.log.info(f"file name: {file.filename}, exists", {'app': 'dfile-up-res'})
            return f"{app.config['DOMAIN']}/d/{f.path}"

    s3 = S3(app.config, app.log)

    ok, res, err = s3.upload_file(file, BUCKET_NAME)

    if not ok:
        return err, 503

    app.log.info(f"upload res: {res}", {'app': 'dfile-up-res'})
    source = request.user_agent.browser or 'shell'
    if len(source) > 32:
        source = source[:32]

    fid = res['fid']
    path = res['oname']
    slug = res['slug']

    f = File()
    f.id = fid
    f.hash = file_hash
    f.slug = slug
    f.filename = file.filename
    f.path = path
    f.size = request.content_length or 0
    f.source = source
    f.dl_num = 0
    f.status = 'Y'
    r = f.save()
    app.log.info(f"save res: {r}")

    url = f"{app.config['DOMAIN']}/d/{path}"
    return url


@app.route("/d/<path:path>", methods=["GET"])
# @app.route("/down/<path:path>", methods=["GET"])
def down(path):
    app.log.info(f"path: {path}", {'app': 'dfile-down-req'})

    if not path:
        return f'invalid path: {path}', 404

    slug, ext = os.path.splitext(path)  # str(path)[1:]
    fid = shorty.i58decode(slug)
    f = File.get_by_id(fid)
    if not f:
        return f'file does not exist: {path}', 404

    path = f.path
    f.dl_num += 1
    f.lastdl_at = dt.utcnow()
    db.commit()

    url = f"{app.config['S3_ENDPOINT']}/{BUCKET_NAME}/{path}"

    return redirect(url, code=302)


@app.route("/stat", methods=["GET"])
def stat():
    file_count = File.count() + app.config['INIT_FILE_COUNT']
    return {'file_count': file_count}


def __read_file_hash(file):
    try:
        bytes = file.read()
        if len(bytes) == 0:
            return False, '', 'empty'

        file_hash = ipfs_hash(bytes)
        return True, file_hash, ''
    except Exception as ex:
        app.log.warning(f"file name: {file.filename}, hash error: {ex}")
        return False, '', str(ex)
    finally:
        file.seek(0, 0)
