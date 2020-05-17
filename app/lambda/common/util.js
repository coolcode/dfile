const Base58 = require('base-58')
const U64 = require("int64-buffer").Uint64BE;

const i58encode = (n) => {
    console.info(`n: `, n)
    const u64 = new U64(n, 10)
    console.info(`u64: `, u64)
    console.info(`u64 len: `, u64.byteLength)
    console.info(`u64 array: `, u64.toArray())
    const arr = u64.toArray()
    let i = 0;
    for (; i < arr.length; i++) {
        if (arr[i] > 0) {
            break
        }
    }

    const u = arr.slice(i)
    console.info(`u: `, u)

    return Base58.encode(u)
}

const i58decode = (s) => {
    console.info(`decode: ${s}`)
    const buf = new Buffer(Base58.decode(s))
    // console.info(`buf: ${buf}`)
    const u64 = buf.readUIntBE(0, buf.byteLength)
    console.info(`u64: `, u64)
    console.info(`u64 type: `, typeof u64)
    // const u64 = new U64(buf)
    // console.info(`u64: ${u64}`)
    return u64//.toString(10)
}

module.exports = {
    i58encode,
    i58decode,
}