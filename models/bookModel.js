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

exports.getAuthors = async (id) => {
  const [rows] = await dbConnection.query(
    `
    SELECT authors.* FROM authors
    JOIN authors_books ON authors.id = authors_books.author_id
    JOIN books ON authors_books.book_id = books.id
    WHERE books.id = ?
  `,
    [id]
  );

  return rows;
};

exports.getGenres = async (id) => {
  const [rows] = await dbConnection.query(
    `
    SELECT genres.* FROM genres
    JOIN books_genres ON genres.id = books_genres.genre_id
    JOIN books ON books_genres.book_id = books.id
    WHERE books.id = ?
  `,
    [id]
  );

  return rows;
};
