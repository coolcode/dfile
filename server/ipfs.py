import hashlib
#from collections import namedtuple

from base58 import b58encode, b58decode

SHA1 = 0x11
SHA256 = 0x12
SHA512 = 0x13

hash_functions = {
    SHA1: hashlib.sha1,
    SHA256: hashlib.sha256,
    SHA512: hashlib.sha512,
}

# DecodedMultihash = namedtuple('DecodedMultihash', ['code', 'digest'])
#
#
# def decode(hashstr):
#     hashbytes = b58decode(hashstr)
#
#     if len(hashbytes) < 3:
#         raise Exception("Multihash must be at least 3 bytes")
#     if len(hashbytes) > 129:
#         raise Exception("Multihash too long. must be < 129 bytes")
#
#     hash_func_id, hash_length = list(bytearray(hashbytes[0:2]))
#     hash_contents = hashbytes[2:]
#
#     if hash_length != len(hashbytes)-2:
#         raise Exception("Multihash length inconsistent")
#
#     return DecodedMultihash(
#         code=hash_func_id,
#         digest=hash_contents,
#     )
#

def encode(bytes, func_id=SHA256):
    try:
        hash_func = hash_functions[func_id]
    except KeyError:
        raise Exception("Requested hash type is not supported")

    hasher = hash_func(bytes)
    data = hasher.digest()
    size = hasher.digest_size

    if size > 127:
        raise Exception("multihash does not yet support digests longer than 127 bytes")

    output = chr(func_id).encode('ascii') + chr(size).encode('ascii') + data
    return str(b58encode(output), 'latin-1')

if __name__ == "__main__":
    print(encode(b"Hash me!") == b"QmepSLzJZG2LpJi9fak5Sgg4nQ2y7MaMGbD54DWyDrrxJt")
    #print(decode(b"QmepSLzJZG2LpJi9fak5Sgg4nQ2y7MaMGbD54DWyDrrxJt").digest == hashlib.sha256(b"Hash me!").digest())