const fs = require('fs')

const buf = fs.readFileSync("/Users/bruce/Downloads/1.png");
console.info("buf:", buf)
console.info("len:", buf.byteLength)

const buf2 = fs.readFileSync("/Users/bruce/Downloads/2.png");
console.info("buf2:", buf2)
console.info("len2:", buf2.byteLength)