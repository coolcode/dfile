from flask.config import Config
import os

APP_DIR = os.path.abspath(os.path.dirname(__file__))
APP_DIR = os.path.abspath(os.path.join(APP_DIR, os.pardir))
api_dir = os.path.join(APP_DIR, 'api')

config = Config(api_dir)
config_value = os.environ.get('CONFIG')
config_file = ''

if config_value:
    print(f'** config: \n{config_value}')
    config_filename = "_config"
    full_config_name = config_filename + '.py'
    config_file = os.path.join(api_dir, full_config_name)
    print(f'** write to {config_file}')
    with open(config_file, "w") as file:
        file.write(config_value)
        file.close()
else:
    config_filename = os.environ.get('CONFIG_NAME') or 'config'
    full_config_name = config_filename + '.py'
    config_file = os.path.join(api_dir, full_config_name)

log_dir = os.path.join(APP_DIR, 'logs')
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

config.from_pyfile(full_config_name)