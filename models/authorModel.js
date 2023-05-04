const dbConnection = require('../config/db.js');

exports.getAuthors = async () => {
  const [rows] = await dbConnection.query('SELECT * FROM authors');

  return rows;
};

exports.getAuthor = async (id) => {
  const [rows] = await dbConnection.query(
    `
  SELECT *
  FROM authors
  WHERE id = ?
  `,
    [id]
  );

  return rows[0];
};
