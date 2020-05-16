from sqlalchemy.orm import relationship
from .extensions import db
from .queryable_mixin import QueryableMixin
import json


def commit_session():
    db.session.commit()


def execute_sql(statement, *multiparams, **params):
    return db.engine.execute(statement, *multiparams, **params)


db.commit = commit_session
db.execute_sql = execute_sql
# Alias common SQLAlchemy names
Column = db.Column
relationship = relationship


def to_dict(inst, cls=None):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    convert["DATETIME"] = __convert_datetime
    # add your conversions for things like datetime's
    # and what-not that aren't serializable.
    d = dict()
    if cls is None:
        cls = inst.__class__
    for c in cls.__table__.columns:
        v = getattr(inst, c.name)
        # print("c.type: " + str(c.type))
        if str(c.type) in convert.keys() and v is not None:
            try:
                # print("c(v): " + str(convert[str(c.type)](v)))
                d[c.name] = convert[str(c.type)](v)
            except:
                d[c.name] = "Error:  Failed to convert using ", str(convert[str(c.type)])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v
    return d


def __convert_datetime(v):
    return v.strftime('%Y-%m-%d %H:%M:%S')


QueryableMixin.session = db.session


class BaseModel(db.Model, QueryableMixin):
    __abstract__ = True

    # @property
    # def session(self):
    #     return db.session

    @property
    def dict(self):
        return to_dict(self)

    def __str__(self):
        return json.dumps(to_dict(self))


Model = BaseModel


# From Mike Bayer's "Building the app" talk
# https://speakerdeck.com/zzzeek/building-the-app
class SurrogatePK(object):
    """A mixin that adds a surrogate integer 'primary key' column named ``id`` \
        to any declarative-mapped class.
    """

    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)


def reference_col(tablename, nullable=False, pk_name='id', **kwargs):
    """Column that adds primary key foreign key reference.

    Usage: ::

        category_id = reference_col('category')
        category = relationship('Category', backref='categories')
    """
    return db.Column(db.ForeignKey('{0}.{1}'.format(tablename, pk_name)), nullable=nullable, **kwargs)
