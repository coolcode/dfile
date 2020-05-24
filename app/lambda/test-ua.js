const util = require("./common/util")

exports.handler = async (event, context, callback) => {
    const agent = util.getBrowserInfo(event.headers['user-agent']);
    return {
        statusCode: 200,
        body: agent // QmepSLzJZG2LpJi9fak5Sgg4nQ2y7MaMGbD54DWyDrrxJt
    }
};