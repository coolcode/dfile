import os

APP_DIR = os.path.abspath(os.path.dirname(__file__))
api_dir = os.path.join(APP_DIR, '')

config_value = os.environ.get('CONFIG')

if config_value:
    print(f'** config: \n{config_value}')
    config_filename = os.environ.get('CONFIG_NAME') or 'config'
    full_config_name = config_filename + '.py'
    config_file = os.path.join(api_dir, full_config_name)
    print(f'** write to {config_file}')
    with open(config_file, "w") as file:
        file.write(config_value)
        file.close()
