const util = require('./common/util')
const db = require('./db')

exports.handler = async (event, context, callback) => {
    let t0 = Date.now(), start = Date.now()
    console.info(`path: ${event.path}`)
    const [, , path] = event.path.split("/")
    if (!path) {
        return {
            statusCode: 404,
            body: `invalid path: ${path}`
        }
    }

    const [slug, _] = path.split('.')
    const fid = util.i58decode(slug)
    const f = await db.getFile(fid)
    if (!f) {
        return {
            statusCode: 404,
            body: `file does not exist: ${path}`
        }
    }
    console.info(`** [time] [db read] ${util.deltaTime(start)}s`);
    start = Date.now()

    const url = `${process.env.S3_ENDPOINT}/dfile/${f.path}`
    console.info(`res ${path}, ${fid}, download url: ${url}`)

    await db.updateFile(fid, {dl_num: f.dl_num + 1, lastdl_at: new Date()})
    console.info(`** [time] [db update] ${util.deltaTime(start)}s`);
    console.info(`** [time] [total] ${util.deltaTime(t0)}s`);

    //redirect
    return {
        statusCode: 302,
        headers: {
            Location: url,
        }
    }
};