from ..yopo.app_context import app_context

app = app_context(__name__)


@app.route("/", methods=["GET"])
def index():
    return "DFile - A fancy file sharing mode. Github: https://github.com/coolcode/dfile"


@app.route('/version', methods=["GET"])
def version():
    with open('./VERSION', 'rb') as file:
        ver = str(file.read(), 'utf-8')
    msg = f'DFile API {ver}'
    app.log.info(msg)
    return msg


@app.route('/503', methods=["GET"])
def p503():
    raise ValueError('503 error!')
