from base58 import b58encode, b58decode


def i58encode(n):
    bs = __int_to_bytes(n)
    return str(b58encode(bs), 'latin-1')


def i58decode(s):
    if not s:
        return 0
    bs = bytes(s, 'latin-1')
    bs = b58decode(bs)
    n = __int_from_bytes(bs)
    return n


def __int_to_bytes(x: int) -> bytes:
    return x.to_bytes((x.bit_length() + 7) // 8, 'big')


def __int_from_bytes(xbytes: bytes) -> int:
    return int.from_bytes(xbytes, 'big')


if __name__ == "__main__":
    ns = [0, 1232, 30839699496976, 31014832656400, 31034599989264]
    for n in ns:
        s = i58encode(n)
        print(f'{n} -> {s}')
        n = i58decode(s)
        print(f'{s} -> {n}')
