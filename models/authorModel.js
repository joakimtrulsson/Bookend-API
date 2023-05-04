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

exports.getBooks = async (id) => {
  const [rows] = await dbConnection.query(
    `
    SELECT books.* FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors_books.author_id = authors.id
    WHERE authors.id = ?
  `,
    [id]
  );

  return rows;
};
