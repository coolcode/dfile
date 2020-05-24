/*
*
* """
This is a Twitter snowflake like scheme generator that fits in 53 bits (for JavaScript, Redis sorted sets, ...)
Its scheme is:
    timestamp | worker_id | sequence
     41 bits  |  8 bits   |  4 bits
Timestamp is in milliseconds since the epoch allowing for 69 years of ids.
Each id generated per millisecond receives a unique auto incrementing sequence
number. Each worker can produce 16 ids per millisecond.
The scheme allows for 256 unique workers, so at most 4 million ids
(256*16*1000) can be produced per second with this scheme.
"""

/**
 * A function for converting hex <-> dec w/o loss of precision.
 * By Dan Vanderkam http://www.danvk.org/hex2dec.html
 */

// Adds two arrays for the given base (10 or 16), returning the result.
// This turns out to be the only "primitive" operation we need.
function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
        var xi = i < x.length ? x[i] : 0;
        var yi = i < y.length ? y[i] : 0;
        var zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
}

// Returns a*x, where x is an array of decimal digits and a is an ordinary
// JavaScript number. base is the number base of the array x.
function multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];

    var result = [];
    var power = x;
    while (true) {
        if (num & 1) {
            result = add(result, power, base);
        }
        num = num >> 1;
        if (num === 0) break;
        power = add(power, power, base);
    }

    return result;
}

function parseToDigitsArray(str, base) {
    var digits = str.split("");
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
        var n = parseInt(digits[i], base);
        if (isNaN(n)) return null;
        ary.push(n);
    }
    return ary;
}

function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;

    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }

    var out = "";
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }
    return out;
}

function hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === "0x") hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
}

const Snowflake = function (options) {
    const worker_id_bits = 8
    const max_worker_id = (1 << worker_id_bits) - 1
    const sequence_bits = 4
    const max_seq_id = (1 << sequence_bits) - 1

    console.info(`max_worker_id: ${max_worker_id}`)

    options = options || {};
    const mid = (options.mid || 1) % max_worker_id;
    const offset = options.offset || 0;
    let seq = 0;
    let lastTime = 0;


    const generate = () => {
        var time = Date.now(),
            bTime = (time - offset).toString(2);

        // get the sequence number
        if (lastTime == time) {
            seq++;

            if (seq > max_seq_id) {
                seq = 0;
            }
        } else {
            seq = 0;
        }

        lastTime = time;

        var bSeq = seq.toString(2),
            bMid = mid.toString(2);

        // create sequence binary bit
        while (bSeq.length < sequence_bits) {
            bSeq = "0" + bSeq;
        }
        while (bMid.length < worker_id_bits) {
            bMid = "0" + bMid;
        }
        var bid = bTime + bMid + bSeq;
        var id = "";

        for (var i = bid.length; i > 0; i -= 4) {
            id = parseInt(bid.substring(i - 4, i), 2).toString(16) + id;
        }

        return hexToDec(id);
    }
    return {generate}
}

// Tuesday, February 18, 2020 3:00:00 AM GMT
// xxxxxxxxx = 1587206303750
const offset = 1581994800000
const generator = Snowflake({offset,})

module.exports = {
    Snowflake,
    generate: generator.generate
}