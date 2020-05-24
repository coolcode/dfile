const util = require('./common/util')
const parser = require('./common/parser')
const ospath = require('path')

const MAXIMUM_REQUEST_SIZE = 100 * 1024 * 1024  // 100M

/*  curl -# -F file=@test.txt http://localhost:9000/hash */
exports.handler = async (event, context, callback) => {
    const start = Date.now()

    console.info('event: ', event)
    const f = await parser.parse(event)
    console.info('file: ', f)
    const fileContent = Buffer.from(f.file)
    const contentType = f.contentType
    const filename = f.filename || ''
    const ext = ospath.extname(filename)
    console.info(`filename: ${filename}, ext: ${ext}`)
    const contentLength = fileContent.byteLength
    let reqSize = ''
    if (!contentLength) {
        return util.response('empty file', 400)
    }

    if (contentLength >= 1024 * 1024) {
        const r = (contentLength / (1024 * 1024)).toFixed(1)
        reqSize = `${r} mb`
    } else if (contentLength >= 1024) {
        const r = (contentLength / (1024)).toFixed(0)
        reqSize = `${r} kb`
    } else {
        reqSize = `${contentLength} b`
    }

    console.info(`file name: ${filename}, req size: ${reqSize}`)
    if (contentLength > MAXIMUM_REQUEST_SIZE) {
        console.warn(`file name: ${filename}, excel maximum request size`)
        return util.response('request length limited', 400)
    }

    // check if file exists
    const hash = await util.hashFile(fileContent)
    console.info(`hash: ${hash}"`)
    console.info(`** [time] [ready] ${util.deltaTime(start)}s`)

    return util.response(hash)
}