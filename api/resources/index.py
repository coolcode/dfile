from ..yopo.app_context import app_context

app = app_context(__name__)


@app.route('/version')
def index():
    with open('./VERSION', 'rb') as file:
        ver = str(file.read(), 'utf-8')
    msg = f'DFile API {ver}'
    app.log.info(msg)
    return msg
