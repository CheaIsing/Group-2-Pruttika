const conn = require("../config/db");

const executeQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, data) => {
      if (err) {
        reject(err); 
      } else {
        resolve(data); 
      }
    });
  });
};

module.exports = { executeQuery };
