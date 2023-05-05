const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const dbConnection = require('../config/db');
const catchAsync = require('../utils/catchAsync.js');

exports.createTable = async () => {
  try {
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
        PRIMARY KEY (id)
      )
    `);

    console.log('User table created or already exists.');
  } catch (error) {
    return next(new AppError('Something went wrong with creating the users table!', 500));
  }
};

exports.createUser = catchAsync(async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password + process.env.BCRYPT_HASH, 10);

  const sql = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
  const values = [username, hashedPassword, role];
  const result = await dbConnection.query(sql, values);
  const newUser = result.insertId;

  return newUser;
});
