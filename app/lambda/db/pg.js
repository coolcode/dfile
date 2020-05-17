const {Pool} = require('pg')

require('dotenv').config()
const pool = new Pool()

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    // process.exit(-1)
})

pool.connect((err) => {
    if (err) {
        console.error(err)
    } else {
        console.info('Successfully connected to host')
    }
})

const getAllFiles = async () => {
    const query = 'SELECT * FROM file'
    let result = await pool.query(query)
    console.info(result.rows)
    return result.rows
}

const saveFile = async (params) => {
    const now = new Date()
    const query = "insert into file(id, slug, filename, size, path, source, dl_num, hash, status, created_at, updated_at, lastdl_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)"
    const values = [params.id, params.slug, params.filename, params.size, params.path, params.source, 0, params.hash, 'Y', now, now, now]
    let result = await pool.query(query, values)
    console.info(result)
}


module.exports = {
    getAllFiles,
    saveFile,
}