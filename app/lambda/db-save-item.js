const db = require('./db');

exports.handler = async (event, context, callback) => {
    const start = Date.now()
    const f = {id: 12123123, slug: 'xxx', filename: 'xxx.txt', size: 123123, path: 'zdfasf.txt', source: 'test', hash: 'zwer2'} //params.id, params.slug, params.filename, params.size, params.path, params.source
    await db.saveFile(f)
    // try {
    //     await db.saveFile(f)
    // } catch (e) {
    //     console.error(e)
    //     return {
    //         statusCode: 503,
    //         body: `${e}`
    //     }
    // }

    const duration = ((Date.now() - start) / 1000.0).toFixed(2)
    console.info('saved file');
    return {
        statusCode: 200,
        body: `ok: ${duration}s`
    }
};