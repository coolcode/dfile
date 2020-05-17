exports.handler = (event, context, callback) => {
     console.info('context: '+ JSON.stringify(context))
    callback(null, {
        statusCode: 200,
        body: 'Hello World!'
    })
};