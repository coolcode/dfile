const db = require('./db');

exports.handler = async (event, context, callback) => {
    const start = Date.now()
    const files = await db.getAllFiles()

    const duration = ((Date.now() - start) / 1000.0).toFixed(2)
    const res = JSON.stringify({duration, files})
    console.info(res);
    return {
        statusCode: 200,
        body: res
    }
};