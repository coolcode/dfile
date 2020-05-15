from flask import Blueprint, request
from functools import wraps
# from flask_jwt_extended import current_user, jwt_required, jwt_optional, verify_jwt_in_request, get_jwt_claims
from inspect import isfunction, getfullargspec
from . import util
from .conf import config
from .log import getLogger

"""

usage: 
app = app_context(__name__)
@app.request_mapping(<param name>=<rule>)

sample:

@app.route('/auth/login')
@app.request_mapping(username='', password='')
def login(username, password, remember_me=False):
    ...

"""


def app_context(name, url_prefix='/'):
    return _AppContext(name, url_prefix)


class _AppContext:
    def __init__(self, name, url_prefix='/'):
        self.log = getLogger(name)
        self.blueprint = Blueprint(name, name, url_prefix=url_prefix)
        # self.token_required = jwt_required
        # self.token_optional = jwt_optional
        # self.admin_required = jwt_admin_required
        self.config = config

    # @property
    # def current_user(self):
    #     return current_user

    def route(self, rule, methods=['GET', 'POST'], *args, **options):
        def decorator(func):
            endpoint = options.pop("endpoint", func.__name__)
            # options['methods'] = methods
            self.blueprint.add_url_rule(rule, endpoint, func, methods=methods, **options)

        return decorator

    # request parameter mapping and validator
    def request_mapping(self, *args, **kwargs):

        # print('=========args: {}'.format(args))
        # print('=========kwargs: {}'.format(kwargs))

        def decorator(func, spec=True):
            func_arg_names = getfullargspec(func).args

            # print('=========kwargs b4: {}'.format(kwargs))
            if spec:
                kwargs.update(zip(func_arg_names, args))

            # print('=========kwargs af: {}'.format(kwargs))

            @wraps(func)
            def wrapper(*func_args, **func_kwargs):

                argspec = getfullargspec(func)
                # print('=========func_arg_names: {}'.format(argspec.args))
                # print('=========func_args: {}'.format(func_args))
                # print('=========func_kwargs: {}'.format(func_kwargs))
                # print('=========request args: {}'.format(request.args))
                # print('=========argspec.defaults: {}'.format(argspec.defaults))
                if argspec.defaults:
                    n_postnl_args = len(argspec.args) - len(argspec.defaults)
                    defaults = {k: v for k, v in zip(argspec.args[n_postnl_args:], argspec.defaults)}
                else:
                    defaults = {}

                json_data = request.get_json(force=True, silent=True) or {}

                values = {}
                for arg_name in argspec.args:
                    if arg_name in json_data:
                        values[arg_name] = json_data[arg_name]
                    elif arg_name in request.form:
                        values[arg_name] = request.form[arg_name]
                    elif arg_name in request.args:
                        values[arg_name] = request.args[arg_name]
                    elif arg_name in defaults:
                        values[arg_name] = defaults[arg_name]
                    else:
                        values[arg_name] = ""

                # print('=========values: {}'.format(values))
                # print('=========kwargs [wrapper]: {}'.format(kwargs))
                err, status_code = self.validate(values, **kwargs)
                if status_code != 200:
                    return err, status_code

                return func(**values)

            return wrapper

        if len(args) == 1 and len(kwargs) == 0 and isfunction(args[0]):
            # print('==========args: {}'.format(args))
            return decorator(args[0], spec=False)

        return decorator

    def validate(self, values, **kwargs):
        for key, rule in kwargs.items():
            if key not in values:
                self.log.warning('values have not contain key: {}'.format(key))
                continue
            v = values[key]
            # capitalized_key = key.capitalize()
            # print("{0} = {1}".format(key, rule))
            if (not rule or rule == 'empty') and util.is_empty(v):
                return '{} cannot be empty.'.format(key), 422
            elif rule == 'email' and not util.is_email(v):
                return 'The email address is invalid.', 422

        return 'ok', 200


# Here is a custom decorator that verifies the JWT is present in the request, as well as insuring that this user has a role of `admin` in the access token
# def jwt_admin_required(fn):
#     @wraps(fn)
#     def wrapper(*args, **kwargs):
#         verify_jwt_in_request()
#         claims = get_jwt_claims()
#         print(f'claims-------: {claims}')
#         if 'role' not in claims or claims['role'] != 'admin':
#             return 'Admin only!', 403
#         else:
#             return fn(*args, **kwargs)
#
#     return wrapper
