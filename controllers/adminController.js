const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { promisify } = require('util');

dotenv.config({ path: './config/.env' });

const catchAsync = require('../utils/catchAsync.js');

const { createUser, login, checkIfUserExists } = require('../models/userModel.js');
const AppError = require('../utils/appError.js');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.TOKEN_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { userName, password, role } = req.body;
  const newUser = await createUser(userName, password, role);

  if (newUser === 409) {
    return next(new AppError('User already exists.', 409));
  }

  if (newUser === 400) {
    return next(new AppError('Invalid request.', 400));
  }

  createSendToken(newUser, 201, req, res);
});

exports.signinUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and password.', 400));
  }

  const result = await login(username, password);

  if (result === 401) {
    return next(new AppError('Incorrect username or password.', 401));
  }

  createSendToken(result, 200, req, res);
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.replace('Bearer', '').replace(' ', '');
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }
  // Validera token.
  const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

  const freshUser = await checkIfUserExists(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user belonging to the token does not longer exist.', 401));
  }

  req.user = freshUser;

  next();
});

exports.test = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Du är inne!',
    },
  });
});
