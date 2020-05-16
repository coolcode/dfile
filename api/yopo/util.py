import re
from datetime import datetime, timedelta
import uuid
import time
from json import dumps, loads
from .log import getLogger

log = getLogger(__name__)

re_email = re.compile(r'^\w+[\w\-\.]*\@\w+((-\w+)|(\w*))\.[a-z]+', re.VERBOSE)


def is_empty(v):
    return v is None or str(v) == '' or str(v).strip(' ') == ''


def is_email(email):
    is_valid = check_len(email, 5, 100)
    if not is_valid:
        return False

    return re_email.search(email) is not None


def relative_time(**kwargs):
    return datetime.utcnow() + timedelta(**kwargs)


def gen_uid():
    return str(uuid.uuid4()).replace('-', '')


def utcnow():
    return datetime.utcnow()


def parse_date(v):
    if not v:
        return utcnow()
    return datetime.strptime(v, '%Y-%m-%d')


def to_string(v):
    if not v:
        return ''
    return v.strftime('%Y-%m-%d %H:%M:%S')


from . import snowflake

sf = snowflake.generator(now=lambda: int(utcnow().timestamp() * 1000))


def snowflake_id():
    return next(sf)


PAGE_SIZE = 10


def paging(query, page=1):
    p = query.paginate(page, per_page=PAGE_SIZE, error_out=False)
    return p


def paging_dict(query, page=1):
    p = query.paginate(page, per_page=PAGE_SIZE, error_out=False)
    return {
        "pages": p.pages,
        "has_prev": p.has_prev,
        "has_next": p.has_next,
        "prev_num": p.prev_num,
        "next_num": p.next_num,
        "items": [to_dict(x) for x in p.items]
    }


def list_dict(items):
    return [to_dict(x) for x in items]


def to_dict(instance):
    if isinstance(instance, dict):
        return instance
    if hasattr(instance, 'dict'):
        return instance.dict
    return instance


def wrap_pager(p, **kwargs):
    r = {
        "pages": p.pages,
        "has_prev": p.has_prev,
        "has_next": p.has_next,
        "prev_num": p.prev_num,
        "next_num": p.next_num
    }

    for k, v in kwargs.items():
        r[k] = v

    return r


def perf_counter(title='elapsed'):
    class PerfCounter:
        def __init__(self, _title):
            self.start = time.perf_counter()
            self.title = _title

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_value, traceback):
            log.info("{0}: {1:.1f}s".format(self.title, time.perf_counter() - self.start))

    return PerfCounter(title)


def check_len(s, min_len=0, max_len=0):
    len_s = len(s) if s else 0
    return (len_s <= max_len) and (len_s >= min_len)


def lower(s):
    return str(s).strip(' ').lower() if s else ''


def trim(s):
    return str(s).strip(' ') if s else ''


def json(o):
    return dumps(o)


def sleep(seconds):
    time.sleep(seconds)
