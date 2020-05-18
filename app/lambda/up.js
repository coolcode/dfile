const AWS = require('aws-sdk')
const util = require('./common/util')
const db = require('./db')

/*  curl -# -F file=@test.txt http://localhost:9000/up */
exports.handler = async (event, context, callback) => {
    const start = Date.now()
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    })

    console.info('event: ', event)
    const fileContent = Buffer.from(event.body)
    const contentType = ''
    const filename = 'xxx.jpg'

    const params = {
        Bucket: 'dfile',
        Key: 'dfile/hello.txt',
        Body: fileContent,
        ACL: 'public-read',
        ContentType: contentType || 'text/plain',
        Metadata: {filename: encodeURIComponent(filename)}
    }

    const data = await s3.upload(params).promise()
    console.log(`File uploaded successfully. ${data.Location}`);

    const duration = ((Date.now() - start) / 1000.0).toFixed(2)
    console.info(`** [time] ${duration}s`);
    const url = `https://dfile.app/d/${data.Location}`

    return {
        statusCode: 200,
        body: url
    }
};