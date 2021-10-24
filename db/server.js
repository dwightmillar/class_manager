const { createConnection } = require('mysql')
const config = require('./config.js')

const connection = createConnection(config)

connection.connect()

module.exports = connection