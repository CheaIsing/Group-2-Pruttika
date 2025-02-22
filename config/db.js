const mysql = require('mysql');
require("dotenv").config();

const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_DB,
    password: process.env.PASS ,
    database: process.env.DB,
    port: process.env.DB_PORT || 3306
});

conn.connect((err) => {
    if(err) {
        
        console.log(err);
        console.log(process.env.HOST);
        console.log(process.env.USER);
        console.log(process.env.PASS);
        console.log(process.env.DB);
        console.log(process.env.DB_PORT);
        console.log(process.env.USER_DB);
    }
})

module.exports = conn