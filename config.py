SQLALCHEMY_TRACK_MODIFICATIONS = False

SQLALCHEMY_DATABASE_URI = "postgresql://localhost/dfile"  # "postgresql://0x0@/0x0"
PREFERRED_URL_SCHEME = "https"  # nginx users: make sure to have 'uwsgi_param UWSGI_SCHEME $scheme;' in your config
MAX_CONTENT_LENGTH = 10 * 1024 * 1024
MAX_URL_LENGTH = 4096
DFILE_USE_X_ACCEL_REDIRECT = True  # expect nginx by default
USE_X_SENDFILE = False

IPFS_CONNECT_URL = "/ip4/3.84.136.87/tcp/5001/http"
IPFS_FILE_URL = "http://3.84.136.87:8080/ipfs/"
DOMAIN = "https://dfile.app"
