const util = require('./common/util')
const db = require('./db')

exports.handler = async (event, context, callback) => {
    const start = Date.now()
    console.info(`path: ${event.path}`)
    const [, , path] = event.path.split("/")
    if (!path) {
        return {
            statusCode: 404,
            body: `invalid path: ${path}`
        }
    }

    const [slug, ext] = path.split('.')
    const fid = util.i58decode(slug)
    const f = await db.getFile(fid)
    if (!f) {
        return {
            statusCode: 404,
            body: `file does not exist: ${path}`
        }
    }


    const url = `${process.env.S3_ENDPOINT}/dfile/${f.path}`
    console.info(`res ${path}, ${fid}, download url: ${url}`)

    await db.updateFile(fid, {dl_num: f.dl_num + 1, lastdl_at: new Date()})

    const duration = ((Date.now() - start) / 1000.0).toFixed(2)
    console.info(`** [time] ${duration}s`);
    //redirect
    return {
        statusCode: 302,
        headers: {
            Location: url,
        }
    }
    // return {
    //     statusCode: 200,
    //     body: `Hello, ${path}, ${fid}, ${url}`
    // }
};