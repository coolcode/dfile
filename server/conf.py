from flask.config import Config
import os

APP_DIR = os.path.abspath(os.path.dirname(__file__))
APP_DIR = os.path.abspath(os.path.join(APP_DIR, os.pardir))

config = Config(APP_DIR)
config_value = os.environ.get('CONFIG')
config_file = ''

if config_value:
    print(f'config: \n{config_value}')
    config_file = "_config"
    full_config_name = config_file + '.py'
    with open(os.path.join(APP_DIR, full_config_name), "w") as file:
        file.write(config_value)
        file.close()
else:
    config_file = os.environ.get('CONFIG_NAME') or 'config'
    full_config_name = config_file + '.py'

log_dir = os.path.join(APP_DIR, 'logs')
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

config.from_pyfile(full_config_name)