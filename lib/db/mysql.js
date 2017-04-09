const mysql = require('mysql');
const mysqlConfig = require('./../../config/config').mysql;

const pool = mysql.createPool({
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  password: mysqlConfig.password,
  database: mysqlConfig.database,
  port: mysqlConfig.port,
});


const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        resolve(err);
      }

      connection.query(sql, values, (errQuery, rows) => {
        if (errQuery) {
          reject(errQuery);
        } else {
          resolve(rows);
        }
        connection.release();
      });
    });
  });
};


module.exports = {
  query,
};
