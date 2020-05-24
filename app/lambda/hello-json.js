exports.handler = (event, context, callback) => {
    console.info('event: ', event)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({r: 'Hello World!'})
    })
}