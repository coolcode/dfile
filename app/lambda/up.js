const AWS = require('aws-sdk')
const util = require('./common/util')
const parser = require('./common/parser')
const snowflake = require("./common/snowflake")
const db = require('./db')
const ospath = require('path')

const MAXIMUM_REQUEST_SIZE = 100 * 1024 * 1024  // 100M

/* Due to the limitation of Netlify lambda function, (up to 10s execute time, could not upload large files)
API changed to https://dfile.herokuapp.com */
/* curl -# -F file=@test.txt http://localhost:9000/up */
exports.handler = async (event, context, callback) => {
    if(event.httpMethod!= 'POST'){
        return util.response('Method Not Allowed', 405)
    }

    let t0 = Date.now(), start = Date.now()
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    })

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

    const fid = snowflake.generate() + ''
    console.info('fid: ', fid)
    const slug = util.i58encode(fid)
    console.info('slug: ', slug)
    const oname = `${slug}${ext}`

    // check if file exists
    const hash = await util.hashFile(fileContent)
    if (hash) {
        const fileItem = await db.getFileByHash(hash)
        if (fileItem) {
            console.info(`file name: ${fileItem.filename}, exists"`)
            return util.response(`https://dfile.app/d/${fileItem.path}`)
        }
    }

    console.info(`** [time] [ready] ${util.deltaTime(start)}s`)
    start = Date.now()

    // s3 upload

    const params = {
        Bucket: 'dfile',
        Key: `dfile/${oname}`,
        Body: Buffer.from(f.file),
        ACL: 'public-read',
        ContentType: contentType || 'text/plain',
        Metadata: {filename: encodeURIComponent(filename)}
    }

    // console.info('s3 params: ', params)

    // const data = await s3.upload(params).promise()
    // console.log(`File uploaded successfully. ${data.Location}`)
    console.info(`** [time] [s3 upload] ${util.deltaTime(start)}s`)
    start = Date.now()

    const agent = util.getBrowserInfo(event.headers['user-agent'])
    let source = agent || 'shell'
    if (source && source.length > 64) {
        source = source.substr(0, 64)
    }

    const fileItem = {id: fid, slug, filename, size: contentLength, path: oname, source, hash, bytes: params.Body}
    await db.saveFile(fileItem)

    console.info(`** [time] [db save] ${util.deltaTime(start)}s`)
    console.info(`** [time] [total] ${util.deltaTime(t0)}s`)

    const url = `https://dfile.app/d/${oname}`
    return util.response(url)
}