import datetime as dt

from .yopo.database import db, Model, reference_col, relationship, SurrogatePK


class File(Model, SurrogatePK):
    __tablename__ = 'file'
    slug = db.Column(db.String(32), unique=True, nullable=False, index=True)
    filename = db.Column(db.String(256), unique=False, nullable=False)
    size = db.Column(db.Integer, nullable=True)
    path = db.Column(db.String(256), nullable=True)
    dl_num = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(1), nullable=True)  # d: delete,
    created_at = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    lastdl_at = db.Column(db.DateTime, nullable=True, default=dt.datetime.utcnow)

    def __init__(self, **kwargs):
        self.created_at = dt.datetime.utcnow()
        self.updated_at = dt.datetime.utcnow()
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<File({slug!r}, {filename!r})>'.format(**self)
