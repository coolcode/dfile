const util = require("./common/util")

exports.handler = async (event, context, callback) => {
    const hash = await util.hashFile(Buffer.from('Hash me!'))
    return {
        statusCode: 200,
        body: hash // QmepSLzJZG2LpJi9fak5Sgg4nQ2y7MaMGbD54DWyDrrxJt
    }
};