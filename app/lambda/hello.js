exports.handler = (event, context, callback) => {
    console.info('event: ', event)
    /*  {
  path: '/hello',
  httpMethod: 'GET',
  queryStringParameters: {},
  headers: {
    host: 'localhost:9000',
    connection: 'keep-alive',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng',
    'sec-fetch-site': 'none',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6',
    cookie: '_ga=GA1.1.155757802.1585791892; Hm_lvt_f0989dc7dd9444bb0eb1bf2f9a5a6c17=1585793810; Hm_lpvt_f0989dc7dd9444bb0eb1bf2f9a5a6c17=1585793810; next-i18next=en'
  },
  body: 'W29iamVjdCBPYmplY3Rd',
  isBase64Encoded: true
}*/
    callback(null, {
        statusCode: 200,
        body: 'Hello World!'
    })
};