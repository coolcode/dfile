import logging
from logging.handlers import TimedRotatingFileHandler
from logdna import LogDNAHandler


def init_log(logdna_key=""):
    # set a format which is simpler for console use
    formatter = logging.Formatter('%(asctime)s %(name)-12s: %(levelname)-8s %(message)s')
    # set up logging to file - see previous section for more details
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
                        datefmt='%m-%d %H:%M:%S', )
    # console log
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    console.setFormatter(formatter)
    # add the handler to the root logger
    logging.getLogger('').addHandler(console)

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
        'hostname': 'dapp',
        'ip': '127.0.0.1',
        'index_meta': True
    }

    if logdna_key != "":
        logging.getLogger('').addHandler(LogDNAHandler(logdna_key, options))
