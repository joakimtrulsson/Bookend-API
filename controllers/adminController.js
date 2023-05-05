const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const catchAsync = require('../utils/catchAsync.js');

const { createUser, login } = require('../models/userModel.js');
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
