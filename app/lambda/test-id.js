const snowflake = require("./common/snowflake")

exports.handler = (event, context, callback) => {
    const id = snowflake.generate()
    callback(null, {
        statusCode: 200,
        body: 'id: ' + id
    })
};