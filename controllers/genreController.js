const catchAsync = require('../utils/catchAsync.js');

const { getGenres, getGenre } = require('../models/genreModel.js');
const AppError = require('../utils/appError.js');

exports.getAllGenres = catchAsync(async (req, res, next) => {
  const data = await getGenres();

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      genres: data,
    },
  });
});

exports.getOneGenre = catchAsync(async (req, res, next) => {
  const data = await getGenre(req.params.id);

  console.log(data);

  if (data === undefined) {
    console.log('ads');
    return next(new AppError('No document with that ID found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      genre: data,
    },
  });
});
