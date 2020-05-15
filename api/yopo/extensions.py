# from flask_bcrypt import Bcrypt
from flask_caching import Cache
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# bcrypt = Bcrypt()
db = SQLAlchemy()  # SQLAlchemy(model_class=QueryableMixin)

migrate = Migrate()
cache = Cache()
cors = CORS()
