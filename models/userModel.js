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
        username VARCHAR(50) NOT NULL UNIQUE,
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

exports.createUser = async (username, password, role) => {
  const hashedPassword = await bcrypt.hash(password + process.env.BCRYPT_HASH, 10);

  try {
    const [rows] = await dbConnection.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return 409;
    }

    const [result] = await dbConnection.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    return result.insertId;
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_WARN_DATA_TRUNCATED') return 400;
  }
  // finally {
  //   // dbConnection.end();
  // }
};

exports.login = async (username, password) => {
  try {
    const [rows] = await dbConnection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return 401;
    }

    const user = rows[0];
    const isPasswordCorrect = await bcrypt.compare(password + process.env.BCRYPT_HASH, user.password);

    if (!isPasswordCorrect) {
      return 401;
    }

    return user;
  } catch (err) {
    console.error(err);
    // return next(new AppError('Internal server error.', 500));
  } finally {
    // dbConnection.end();
  }
};

exports.checkIfUserExists = async (id) => {
  console.log(id);
  console.log('här');
  const [rows] = await dbConnection.execute('SELECT * FROM users WHERE id = ?', [id]);
  const freshUser = rows[0];
  return freshUser;
};
