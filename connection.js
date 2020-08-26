require('dotenv').config();
const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const connection = mysql.createPool(config);

const query = (...args) => new Promise((resolve, reject) => {
  connection.query(...args, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

const closeConnection = () => new Promise((resolve, reject) => {
  if (connection) {
    connection.end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  } else {
    resolve();
  }
});

module.exports = {
  connection,
  closeConnection,
  query,
};
