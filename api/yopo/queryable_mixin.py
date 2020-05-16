from flask_sqlalchemy import Model
from .compat import basestring


class QueryableMixin(Model):
    """Mixin that adds convenience methods ."""

    @classmethod
    def get_by_id(cls, record_id):
        """Get record by ID."""
        if any(
                (isinstance(record_id, basestring) and record_id.isdigit(),
                 isinstance(record_id, (int, float))),
        ):
            return cls.query.get(int(record_id))

    @classmethod
    def get(cls, **kwargs):
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def deletes(cls, whereclause, commit=True):
        stmt = cls.__table__.delete().where(whereclause)
        cls.session.execute(stmt)
        return commit and cls.session.commit()

    @classmethod
    def delete_by(cls, commit=True, **kwargs):
        cls.query.filter_by(**kwargs).delete()
        return commit and cls.session.commit()

    @classmethod
    def soft_delete(cls, record_id, commit=True, **kwargs):
        return cls.updates(cls.id == record_id, commit, status='N', **kwargs)

    @classmethod
    def updates(cls, whereclause, commit=True, **kwargs):
        stmt = cls.__table__.update().where(whereclause).values(**kwargs)
        # print(f'update stmt: {stmt}')
        cls.session.execute(stmt)
        return commit and cls.session.commit()

    @classmethod
    def update_by_id(cls, record_id, commit=True, **kwargs):
        return cls.updates(cls.id == record_id, commit, **kwargs)
        # print(f'#{record_id} update dict: {dict(**kwargs)}')
        # # stmt = cls.query.filter_by(id=record_id).update(dict(**kwargs))
        # stmt = cls.__table__.update().where(cls.id == record_id).values(**kwargs)
        # print(f'update stmt: {stmt}')
        # cls.session.execute(stmt)
        # return commit and cls.session.commit()

    @classmethod
    def create(cls, **kwargs):
        """Create a new record and save it the database."""
        instance = cls(**kwargs)
        return instance.save()

    def update(self, commit=True, **kwargs):
        """Update specific fields of a record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        if commit:
            self.session.commit()
        return self

    def save(self, commit=True):
        """Save the record."""
        self.session.add(self)
        if commit:
            self.session.commit()
        return self

    def delete(self, commit=True):
        """Remove the record from the database."""
        self.session.delete(self)
        if commit:
            self.session.commit()
        return self

    @classmethod
    def rollback_session(cls):
        cls.session.rollback()

    @classmethod
    def _preprocess_params(cls, kwargs):
        """Returns a preprocessed dictionary of parameters. Used by default
        before creating a new instance or updating an existing instance.

        Parameters
        -----------

        **kwargs: a dictionary of parameters
        """
        kwargs.pop('csrf_token', None)
        return kwargs

    @classmethod
    def filter_by(cls, **kwargs):
        """Returns a list of instances of the model filtered by the
        specified key word arguments.

        Parameters
        ----------

        **kwargs: filter parameters

        """
        limit = kwargs.pop('limit', None)
        reverse = kwargs.pop('reverse', False)
        q = cls.query.filter_by(**kwargs)
        if reverse:
            q = q.order_by(cls.id.desc())
        if limit:
            q = q.limit(limit)
        return q

    @classmethod
    def filter(cls, *criterion, **kwargs):
        limit = kwargs.pop('limit', None)
        reverse = kwargs.pop('reverse', False)
        q = cls.query.filter_by(**kwargs).filter(*criterion)
        if reverse:
            q = q.order_by(cls.id.desc())
        if limit:
            q = q.limit(limit)
        return q

    @classmethod
    def count(cls, *criterion, **kwargs):
        if criterion or kwargs:
            return cls.filter(
                *criterion,
                **kwargs).count()
        else:
            return cls.query.count()

    @classmethod
    def all(cls, *criterion, **kwargs):
        """Returns a list of instances of the service's model filtered by the
        specified key word arguments.

        :param **kwargs: filter parameters
        """
        return cls.filter(*criterion, **kwargs).all()

    @classmethod
    def first(cls, *criterion, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.

        :param **kwargs: filter parameters
        """
        return cls.filter(*criterion, **kwargs).first()

    @classmethod
    def one(cls, *criterion, **kwargs):
        return cls.filter(*criterion, **kwargs).one()

    @classmethod
    def last(cls, *criterion, **kwargs):
        kwargs['reverse'] = True
        return cls.first(*criterion, **kwargs)

    @classmethod
    def new(cls, **kwargs):
        """Returns a new, unsaved instance of the service's model class.

        :param **kwargs: instance parameters
        """
        return cls(**cls._preprocess_params(kwargs))

    @classmethod
    def add(cls, model, commit=True):
        if not isinstance(model, cls):
            raise ValueError('%s is not of type %s'(model, cls))
        cls.session.add(model)
        try:
            if commit:
                cls.session.commit()
            return model
        except:
            cls.session.rollback()
            raise

    @classmethod
    def add_all(cls, models, commit=True, check_type=False):
        if check_type:
            for model in models:
                if not isinstance(model, cls):
                    raise ValueError('%s is not of type %s'(model, cls))
        cls.session.add_all(models)
        try:
            if commit:
                cls.session.commit()
            return models
        except:
            cls.session.rollback()
            raise

    # @classmethod
    # def _get(cls, key, keyval, user_id=None):
    #     result = cls.query.filter(
    #         getattr(cls, key) == keyval)
    #     if user_id and hasattr(cls, 'user_id'):
    #         result = result.filter(cls.user_id == user_id)
    #     return result.one()

    # @classmethod
    # def get(cls, keyval, key='id', user_id=None):
    #     """Returns an instance of the service's model with the specified id.
    #     Returns `None` if an instance with the specified id does not exist.
    #
    #     :param id: the instance id
    #     """
    #     if (key in cls.__table__.columns
    #             and cls.__table__.columns[key].primary_key):
    #         if user_id and hasattr(cls, 'user_id'):
    #             return cls.query.filter_by(id=keyval, user_id=user_id).one()
    #         return cls.query.get(keyval)
    #     else:
    #         result = cls.query.filter(
    #             getattr(cls, key) == keyval)
    #         if user_id and hasattr(cls, 'user_id'):
    #             result = result.filter(cls.user_id == user_id)
    #         return result.one()

    # @classmethod
    # def create(cls, **kwargs):
    #     """Returns a new, saved instance of the service's model class.
    #
    #     :param **kwargs: instance parameters
    #     """
    #     try:
    #         return cls.add(cls.new(**kwargs))
    #     except:
    #         cls.session.rollback()
    #         raise

    @classmethod
    def build(cls, **kwargs):
        """Returns a new, added but unsaved instance of the service's model class.

        :param **kwargs: instance parameters
        """
        return cls.add(cls.new(**kwargs), commit=False)

    @classmethod
    def find_or_build(cls, **kwargs):
        """Checks if an instance already exists in db with these kwargs else
        returns a new, saved instance of the service's model class.

        :param **kwargs: instance parameters
        """
        return cls.first(**kwargs) or cls.build(**kwargs)

    @classmethod
    def new_all(cls, list_of_kwargs):
        return [cls.new(**kwargs) for kwargs in list_of_kwargs]

    @classmethod
    def build_all(cls, list_of_kwargs):
        return cls.add_all([
            cls.new(**kwargs) for kwargs in list_of_kwargs], commit=False)

    @classmethod
    def find_or_build_all(cls, list_of_kwargs):
        return cls.add_all([cls.first(**kwargs) or cls.new(**kwargs)
                            for kwargs in list_of_kwargs], commit=False)

    @classmethod
    def update_all(cls, *criterion, **kwargs):
        try:
            r = cls.query.filter(*criterion).update(kwargs, 'fetch')
            cls.session.commit()
            return r
        except:
            cls.session.rollback()
            raise

    @classmethod
    def get_and_update(cls, id, **kwargs):
        """Returns an updated instance of the service's model class.

        :param model: the model to update
        :param **kwargs: update parameters
        """
        model = cls.get(id)
        for k, v in cls._preprocess_params(kwargs).items():
            setattr(model, k, v)
        cls.session.commit()
        return model

    @classmethod
    def get_and_setattr(cls, id, **kwargs):
        """Returns an updated instance of the service's model class.

        :param model: the model to update
        :param **kwargs: update parameters
        """
        model = cls.get(id)
        for k, v in cls._preprocess_params(kwargs).items():
            setattr(model, k, v)
        return model
