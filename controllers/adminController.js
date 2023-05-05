const catchAsync = require('../utils/catchAsync.js');

const { createUser } = require('../models/userModel.js');
const AppError = require('../utils/appError.js');

exports.createNewUser = catchAsync(async (req, res, next) => {
  const { userName, password, role } = req.body;
  const newUser = await createUser(userName, password, role);

  res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});
