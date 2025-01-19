const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.DB_PORT | 3306
});

conn.connect((err) => {
    if(err) {
        console.log(err);
    }
})

module.exports = conn