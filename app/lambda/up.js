const util = require('./common/util')
const db = require('./db')

exports.handler = async (event, context, callback) => {
    const start = Date.now()

    const duration = ((Date.now() - start) / 1000.0).toFixed(2)
    console.info(`** [time] ${duration}s`);
    const url = 'xxxx'
    return {
        statusCode: 200,
        body: url
    }
};