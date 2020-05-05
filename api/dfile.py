from flask import Flask, abort, request, jsonify, redirect
from flask_cors import CORS
import os
import logging
from .log import init_log
from .conf import config_file
from .s3 import S3
# from .cloudwatch import Cloudwatch

app = Flask(__name__)
CORS(app)
app.config.from_pyfile(config_file)


init_log(app.config['LOGDNA_KEY'])
log = logging.getLogger('logdna')


global file_count
file_count = int(app.config['INIT_FILE_COUNT'])

MAXIMUM_REQUEST_SIZE = 100 * 1024 * 1024 # 100M
BUCKET_NAME = 'dfile'

@app.route("/", methods=["POST", "PUT"])
@app.route("/up", methods=["POST", "PUT"])
def up():
    try:
        if "file" not in request.files:
            return 'file not foud.', 400

        file = request.files["file"]
        if request.content_length:
            req_size = ''
            if request.content_length >= 1024 * 1024:
                r = round(request.content_length / (1024 * 1024),1)
                req_size = f'{r} mb'
            elif request.content_length >= 1024 :
                r = round(request.content_length / 1024)
                req_size = f'{r} kb'
            else: 
                req_size = f'{request.content_length} b'

            log.info(f"file name: {file.filename}, req size: {req_size}", {'app': 'dfile-up-req'})
            if request.content_length > MAXIMUM_REQUEST_SIZE:
                return 'request length limited.', 400

        
        log.info(f"file name: {file.filename}", {'app': 'dfile-up-req'})

        s3 = S3(app.config, log)
        res = s3.upload_file(file, BUCKET_NAME)

        log.info(f"upload res: {res}", {'app': 'dfile-up-res'})
        if not res['hash']:
            return res['error'], 503

        global file_count
        file_count += 1
        url = f"{app.config['DOMAIN']}/{res['hash']}" 
        return url

    except Exception as e:
        log.exception(f"Upload Error! exception:{e}")
        return "Upload Error! \n", 503


@app.route("/<path:path>", methods=["GET"])
@app.route("/down/<path:path>", methods=["GET"])
def down(path):
    try:
        if not path:
            return "DFile API v1.20.0505. Github: https://github.com/coolcode/dfile", 200

        log.info(f"path: {path}", {'app': 'dfile-down-req'})

        url =  f"{app.config['S3_ENDPOINT']}/{BUCKET_NAME}/{path}"

        return redirect(url, code=302)
    except Exception as e:
        log.exception(f"Download Error! path:{path}, exception:{e}")
        return "Download Error! \n", 503


@app.route("/stat", methods=["GET"])
def stat():
    try:
        # cw = Cloudwatch(app.config, log)
        # s = cw.stat()
        # return jsonify({'s': s})
        global file_count
        file_count+=1
        return {'file_count': file_count},  200

    except Exception as e:
        log.exception(f"Error! exception:{e}")
        return "Error! \n", 503


def debug():
    app.run(debug=True, port=5000, host="0.0.0.0")
    log.info("DFile is debugging.")


if __name__ == "__main__":
    debug()
