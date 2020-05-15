from flask import request, has_request_context
import logging
from logging.handlers import TimedRotatingFileHandler
# from .logdna import LogDNAHandler

HOSTNAME = 'dfile.app'
APPNAME = 'api'


def init_log(logdna_key=""):
    # set a format which is simpler for console use
    formatter = logging.Formatter('%(asctime)s %(name)-12s: %(levelname)-8s %(message)s')
    # set up logging to file - see previous section for more details
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
    # , datefmt='%m-%d %H:%M:%S',
    # console log
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(formatter)
    # add the handler to the root logger
    # logging.getLogger('').addHandler(console)

    # access log
    access_handler = TimedRotatingFileHandler('logs/access.log', when="midnight", interval=1, backupCount=180)
    access_handler.setFormatter(logging.Formatter('%(asctime)s, %(message)s'))
    access_handler.setLevel(logging.INFO)
    logging.getLogger('access.logger').addHandler(access_handler)

    # info file log
    file_handler = TimedRotatingFileHandler('logs/info.log', when="midnight", interval=1, backupCount=7)
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)
    logging.getLogger('').addHandler(file_handler)

    # error file log
    error_handler = TimedRotatingFileHandler('logs/error.log', when="midnight", interval=1, backupCount=7)
    error_handler.setFormatter(formatter)
    error_handler.setLevel(logging.ERROR)
    logging.getLogger('').addHandler(error_handler)

    options = {
        'hostname': HOSTNAME,
        'ip': '127.0.0.1',
        'index_meta': True
    }

    print(f'disable logdna')
    # if logdna_key:
    #     print(f'logdna_key: ***')
    #     logging.getLogger('').addHandler(LogDNAHandler(logdna_key, options))


class _Logger:
    _log: logging.Logger = None

    def __init__(self, name):
        self._name = name
        self._log = logging.getLogger(name)

    def debug(self, msg, options=None, **kwargs):
        self._log.debug(msg)

    def info(self, msg, options=None, **kwargs):
        self._log.info(msg)

    def warning(self, msg, options=None, **kwargs):
        self._log.warning(msg)

    def error(self, msg, options=None, **kwargs):
        self._log.error(msg)

    def exception(self, msg, options=None, **kwargs):
        self._log.exception(msg)

    #
    # def debug(self, msg, options=None, **kwargs):
    #     self._log.debug(msg, self.__combine_options('debug', options or kwargs.items()))
    #
    # def info(self, msg, options=None, **kwargs):
    #     # msg = (str(msg) or '').replace('%(', '$(').strip('?')
    #     self._log.info(msg, self.__combine_options('info', options or kwargs.items()))
    #
    # def warning(self, msg, options=None, **kwargs):
    #     self._log.warning(msg, self.__combine_options('warning', options or kwargs.items()))
    #
    # def error(self, msg, options=None, **kwargs):
    #     self._log.error(msg, self.__combine_options('error', options or kwargs.items()))
    #
    # def exception(self, msg, options=None, **kwargs):
    #     self._log.exception(msg, self.__combine_options('exception', options or kwargs.items()))

    def __combine_options(self, level, custom_options):
        try:
            options = {'app': APPNAME, 'logger': self._name, 'level': level}
            # check http request
            if has_request_context() and request.method != 'OPTIONS':
                # options['clientip'] = request.remote_addr
                # options['method'] = request.method
                # options['request'] = request.url
                # options['bytes'] = request.content_length
                options['req_id'] = request.remote_addr
                options['req_method'] = request.method
                options['req_url'] = request.url
                options['req_len'] = request.content_length

            for k, v in custom_options:
                options[k] = v
            # print('options: {}'.format(options))
            return {'meta': options}
        except Exception as ex:
            self._log.exception(ex)
            return None


def getLogger(name=None) -> _Logger:
    return _Logger(name)
