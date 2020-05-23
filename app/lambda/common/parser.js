const Busboy = require('busboy');

const getContentType = (event) => {
    let contentType = event.headers['content-type']
    if (!contentType) {
        return event.headers['Content-Type'];
    }
    return contentType;
};

const parse = (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': getContentType(event),
        }
    });

    const result = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

        file.on('data', data => {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            result.file = data;
        });

        file.on('end', () => {
            console.log('File [' + fieldname + '] Finished');
            result.filename = filename;
            result.contentType = mimetype;
        });
    });

    busboy.on('field', (fieldname, value) => {
        console.log('Field [' + fieldname + ']: value: ' + (value));
        result[fieldname] = value;
    });

    busboy.on('error', error => reject(`Parse error: ${error}`));

    busboy.on('finish', () => {
        console.info('result:', result);
        resolve(result)
    });

    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
});

module.exports = {parse}