const catchAsync = require('../utils/catchAsync.js');

const { getAuthors, getAuthor, getBooks } = require('../models/authorModel.js');
const AppError = require('../utils/appError.js');

exports.getAllAuthors = catchAsync(async (req, res, next) => {
  const data = await getAuthors();

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      authors: data,
    },
  });
});

exports.getOneAuthor = catchAsync(async (req, res, next) => {
  const data = await getAuthor(req.params.id);

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      author: data,
    },
  });
});

exports.getBooksByAuthor = catchAsync(async (req, res, next) => {
  const data = await getBooks(req.params.id);

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      books: data,
    },
  });
});
