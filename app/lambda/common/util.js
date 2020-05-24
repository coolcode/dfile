const Base58 = require('base-58')
const U64 = require("int64-buffer").Uint64BE
const Hash = require('ipfs-only-hash')
const uaparser = require('ua-parser-js')

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
    const buf = Buffer.from(Base58.decode(s))
    // console.info(`buf: ${buf}`)
    const u64 = buf.readUIntBE(0, buf.byteLength)
    console.info(`u64: `, u64)
    console.info(`u64 type: `, typeof u64)
    return u64//.toString(10)
}

const hashFile = async (buffer) => {
    const hash = await Hash.of(buffer)
    console.info('file hash: ', hash)
    return hash
}

const getBrowserInfo = (useragent) => {
    const ua = uaparser(useragent)
    console.info('ua: ', ua)
    return ua.browser.name || 'shell'
}

const deltaTime = (start) => {
    return ((Date.now() - start) / 1000.0).toFixed(2)
}

const response = (body, statusCode = 200, crossDomain = true) => {
    if (typeof body !== 'string') {
        body = JSON.stringify(body)
    }

    const res = {
        statusCode,
        body
    }

    if (crossDomain && process.env.NODE_ENV == 'development') {
        res.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    }

    return res
}

module.exports = {
    i58encode,
    i58decode,
    hashFile,
    getBrowserInfo,
    deltaTime,
    response
}