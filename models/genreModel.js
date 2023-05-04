const dbConnection = require('../config/db.js');

exports.getGenres = async () => {
  const [rows] = await dbConnection.query('SELECT * FROM genres');

  return rows;
};

exports.getGenre = async (id) => {
  const [rows] = await dbConnection.query(
    `
  SELECT *
  FROM genres
  WHERE id = ?
  `,
    [id]
  );

  return rows[0];
};
