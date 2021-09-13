const { createConnection } = require('mysql');
const mysql = createConnection({
    'host':     process.env.DB_HOST     || '127.0.0.1',
    'user':     process.env.DB_USER     || 'root',
    'password': process.env.DB_PASSWORD || 'root',
    'database': process.env.DB_NAME     || 'test'
})

mysql.connect( err => {
    if (err) console.error('/t* Connecting to MySQL \n\x1b[31m%s\x1b[0m', err)
    console.log('/t* Connecting to MySQL \n\x1b[32m%s\x1b[0m', "OK")
})

module.exports = mysql