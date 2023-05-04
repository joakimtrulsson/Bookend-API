const dotenv = require('dotenv');

const mysql = require('mysql2');

dotenv.config({ path: './config/.env' });

const dbConnection = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

module.exports = dbConnection;
