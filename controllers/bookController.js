const catchAsync = require('../utils/catchAsync.js');

const { getBooks, getBook, getAuthors, getGenres, searchBooks } = require('../models/bookModel.js');
const AppError = require('../utils/appError.js');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  console.log('1');
  const data = await getBooks();

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      books: data,
    },
  });
});

exports.getOneBook = catchAsync(async (req, res, next) => {
  const data = await getBook(req.params.id);
  console.log('1');
  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book: data,
    },
  });
});

exports.getAuthorsByBook = catchAsync(async (req, res, next) => {
  const data = await getAuthors(req.params.id);

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book: data,
    },
  });
});

exports.getGenresByBook = catchAsync(async (req, res, next) => {
  const data = await getGenres(req.params.id);

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book: data,
    },
  });
});

exports.searchBooksByQuery = catchAsync(async (req, res, next) => {
  const { title, isbn, author, genre } = req.query;

  const data = await searchBooks(title, isbn, author, genre);

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      book: data,
    },
  });
});
