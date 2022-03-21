const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "luxor",
    port: 5432,
    password: "luxor",
    database: "luxor"
})

module.exports = client