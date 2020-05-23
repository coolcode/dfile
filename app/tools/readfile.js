const fs = require('fs')

const buf = fs.readFileSync("/Users/bruce/Downloads/image.jpeg");
console.info("buf:", buf)
console.info("len:", buf.byteLength)

const buf2 = fs.readFileSync("/Users/bruce/Downloads/GDdMXBHR.jpeg");
console.info("buf2:", buf2)
console.info("len2:", buf2.byteLength)