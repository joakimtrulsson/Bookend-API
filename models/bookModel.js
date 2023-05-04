const dbConnection = require('../config/db.js');

exports.getBooks = async () => {
  const [rows] = await dbConnection.query('SELECT * FROM books');

  return rows;
};

exports.getBook = async (id) => {
  const [rows] = await dbConnection.query(
    `
  SELECT * 
  FROM books
  WHERE id = ?
  `,
    [id]
  );

  return rows[0];
};
