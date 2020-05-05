from . import snowflake
from datetime import datetime

sf = snowflake.generator(now=lambda: int(datetime.utcnow().timestamp() * 1000))


def snowflake_id():
    return next(sf)