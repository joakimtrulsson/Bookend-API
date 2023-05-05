const catchAsync = require('../utils/catchAsync.js');

const {
  getBooks,
  getBook,
  getAuthors,
  getGenres,
  searchBooks,
  getBookCover,
} = require('../models/bookModel.js');

const AppError = require('../utils/appError.js');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const data = await getBooks();

  const coverUrls = await Promise.all(
    data.map(async (book) => {
      if (book.isbn) {
        const coverImg = await getBookCover(book.isbn);

        return coverImg;
      } else {
        return null;
      }
    })
  );

  const booksWithCoverUrls = data.map((book, index) => ({
    ...book,
    coverUrl: coverUrls[index],
  }));

  res.status(200).json({
    status: 'success',
    results: data.length,
    data: {
      books: booksWithCoverUrls,
    },
  });
});
exports.getOneBook = catchAsync(async (req, res, next) => {
  const data = await getBook(req.params.id);

  if (data.isbn) {
    const coverImg = await getBookCover(data.isbn);
    coverUrl = coverImg || null;
  } else {
    coverUrl = null;
  }

  if (!data) return next(new AppError('No document with that ID found.', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book: {
        ...data,
        coverUrl,
      },
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
