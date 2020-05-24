const db = require('./db')
const util = require('./common/util')

exports.handler = async (event, context, callback) => {
    const start = Date.now()
    const count = (await db.countFile()) + parseInt(process.env.INIT_FILE_COUNT || '0')
    console.info(`** [time] [db count] ${util.deltaTime(start)}s`)

    const res = {'file_count': count}
    console.info(res)
    return util.response(res, 200, false)
}