from flask import Flask, Response, request, has_request_context, g
from flask_cors import CORS
from .extensions import cache, db, migrate, cors

from . import log
from werkzeug.exceptions import NotFound
import time
import os

from pkgutil import iter_modules, extend_path
from pathlib import Path
from importlib import import_module
from .conf import config_file


def create_app(config_object=None):
    """An application factory, as explained here:
    http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__)
    CORS(app)
    app.url_map.strict_slashes = False

    if not config_object:
        print('****************************************')
        print(f'******* {config_file}')
        config_object = config_file

    if isinstance(config_object, str):
        app.config.from_pyfile(config_object)
    else:
        app.config.from_object(config_object)

    # Heroku Config Vars
    if 'DATABASE_URL' in os.environ:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

    if 'HEROKU_POSTGRESQL_COPPER_URL' in os.environ:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('HEROKU_POSTGRESQL_COPPER_URL')

    register_extensions(app)
    register_routes(app)
    register_errorhandlers(app)
    register_shellcontext(app)
    register_http_request(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    # bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    # jwt.init_app(app)
    log.init_log(app.config.get('LOGDNA_KEY'))


def register_routes(app):
    # """Register Flask blueprints."""
    origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')

    package = app.config.get('RESOURCE_PACKAGE_NAME', 'api.resources')
    path = package.replace('.', '/')  # Path(__file__).parent.joinpath('resources')

    app_logger = log.getLogger(__name__)
    app_logger.info(f'dynamically loading package: {package}, path: {path} ')

    mods = list(load_mod(path, package))
    resources = [x.__name__.replace(package + '.', '') for x in mods]
    app_logger.info(f'resources: {resources}')
    for mod in mods:
        # print(mod)
        if hasattr(mod, 'app'):
            blueprint = mod.app.blueprint
            cors.init_app(blueprint, origins=origins)
            app.register_blueprint(blueprint)


def load_mod(path, package):
    # print(f'loading {package} from {path}')
    for (_, name, ispkg) in iter_modules([path]):
        # print(f'name: {name}, ispkg: {ispkg}')
        # if is_package and name != '__pycache__':
        #     p = os.path.join(path, name)
        #     for mod in load_mod(p, f'{package}.{p.name}'):
        #         yield mod

        mod = import_module('.' + name, package)
        # mod_name = f'{package}.{name}'
        # print(f'mod: {mod_name}')
        if hasattr(mod, 'app'):
            yield mod

    for p in Path(path).iterdir():
        if p.is_dir() and p.name != '__pycache__':
            for mod in load_mod(p, f'{package}.{p.name}'):
                yield mod


def register_errorhandlers(app):
    # def error_handler(error: InvalidUsage):
    #     # app.logger.error('error: {}'.format(error))
    #     # app.logger.error('error json: {}'.format(error.to_json()))
    #     response = error_json(error.status_code, 'fail', "ERROR: {}".format(error.message))
    #     # response.status_code = error.status_code
    #     return response, error.status_code
    #
    # app.errorhandler(InvalidUsage)(error_handler)

    def notfound_handler(error: NotFound):
        # app.logger.error('error: {}'.format(error))
        response = "NOT FOUND"  # {"msg": "NOT FOUND", "status": 404}  # error_json(404, 'fail', "NOT FOUND: {}".format(request.url))
        # response.status_code = 404
        return response, 404

    app.errorhandler(404)(notfound_handler)

    # not work
    # def auth_error_handler(error):
    #     response = error_json(401, 'fail', "{}".format(error))
    #     response.status_code = 401
    #     return response
    #
    # app.errorhandler(401)(auth_error_handler)
    # app.errorhandler(403)(auth_error_handler)

    def exception_handler(error: Exception):
        app.logger.exception('error: {}'.format(error))
        # response = "ERROR: {}".format(error)
        # don't show the exception info to client
        # response.status_code = 503
        return 'Unexpected error occurs when the server is unable to handle requests.', 503

    app.errorhandler(Exception)(exception_handler)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'log': log.getLogger('shell')
        }

    app.shell_context_processor(shell_context)


"""
Hack loggers for automatically logging http request info
"""

# maximum json request size: 2M = 2 * 1024 * 1024 bytes
MAXIMUM_JSON_REQUEST_SIZE = 2 * 1024 * 1024


def register_http_request(app):
    @app.teardown_request
    def teardown_request(exception):
        if exception:
            app.logger.exception(exception)

    # logging http request
    @app.before_request
    def before_request():
        if request.method == 'OPTIONS':
            return ''
        g.start = time.perf_counter()
        #  "request_stream": request.stream.read() #, request.data or ''
        app_logger = log.getLogger('access.logger')
        try:
            app_logger.info('[access], {}, {}, {}, len: {}'.format(request.remote_addr, request.method, request.url, request.content_length))

            if request.content_length and request.content_length > MAXIMUM_JSON_REQUEST_SIZE:
                return 'Request length limited.', 400
            # if request.content_length:
            #     app_logger.info(f'content length: {request.content_length}')

        except Exception as ex:
            app_logger.exception('Error on before_request. {}'.format(ex))

    @app.after_request
    def after_request(response: Response):
        app_logger = log.getLogger('access.logger')
        msg = ''
        try:
            if request.method == 'OPTIONS':
                return response

            msg = '{}, {}, {}, {}'.format(request.remote_addr, request.method, request.url, response.status_code)

            r = response.get_data(True)
            app_logger.debug('[resp], {}, {}'.format(msg, r if len(r) < 1000 else str(r)[:1000]))

            #
            # if r and response.is_json:
            #     r_json = json.loads(r)
            # else:
            #     r_json = r
            #
            # if response.status_code == 200:
            #     response.set_data(dumps({'status': 'success', 'msg': '', 'r': r_json}))
            # else:
            #     if (isinstance(r_json, set) or isinstance(r_json, dict)) and r_json['msg']:
            #         r_json = r_json['msg']
            #
            #     response.set_data(dumps({'status': 'fail', 'status_code': response.status_code, 'msg': r_json}))

            # app_logger.debug('[resp], {}, {}'.format(msg, json.dumps(r_json)))

        except Exception as ex:
            app_logger.exception('Error on after_request. {}'.format(ex))

        log_performance(app_logger, msg)
        return response

    def log_performance(app_logger, msg=''):
        try:
            app_logger.info("[perf], {0:.2f}s, {1}".format(time.perf_counter() - g.start, msg))
        except Exception as ex:
            try:
                app_logger.exception(f'Error on log_performance: {ex}')
            except:
                pass

    # def dumps(data):
    #     indent = None
    #     separators = (",", ":")
    #
    #     if app.config["JSONIFY_PRETTYPRINT_REGULAR"] or app.debug:
    #         indent = 2
    #         separators = (", ", ": ")
    #
    #     return json.dumps(data, indent=indent, separators=separators)
