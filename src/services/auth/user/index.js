const {
  checkUserExists,
  createUser,
  getFilteredUsers,
  getUserById,
  updateUserById,
} = require('../../../repositories/auth/index');
const { OTP } = require('../../../constants/otp/index');
const jwt = require('jsonwebtoken');

exports.registerUser = async (phoneNumber, otp) => {
  const isValidOtp = otp == OTP;
  if (!isValidOtp) {
    return {
      statusCode: 401,
      message: 'Invalid OTP',
      data: null,
    };
  }

  let existingUser = await checkUserExists(phoneNumber);
  if (existingUser) {
    return {
      statusCode: 409,
      message: 'User already exists',
      data: null,
    };
  }

  const user = await createUser(phoneNumber);
  if (!user) {
    return {
      statusCode: 500,
      message: 'Failed to create user',
      data: null,
    };
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  return {
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  };
};

exports.loginUser = async (phoneNumber, otp) => {
  const isValidOtp = otp == OTP;
  if (!isValidOtp) {
    return {
      statusCode: 401,
      message: 'Invalid OTP',
      data: null,
    };
  }

  let user = await checkUserExists(phoneNumber);
  if (!user) {
    return {
      statusCode: 404,
      message: 'User not found',
      data: null,
    };
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  return {
    statusCode: 200,
    message: 'User logged in successfully',
    data: {
      user,
      token,
    },
  };
};

exports.getAllUsers = async ({ search, page = 1, perPage = 50, startDate, endDate }) => {
  const filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.$gte = new Date(startDate);
    if (endDate) filters.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * perPage;

  const { users, total } = await getFilteredUsers(filters, skip, perPage);

  return {
    data: users,
    total,
    page,
    perPage,
  };
};

exports.getUserById = async id => {
  const user = await getUserById(id);
  if (!user) {
    return {
      statusCode: 404,
      message: 'User not found',
      data: null,
    };
  }
  return {
    statusCode: 200,
    message: 'User fetched successfully',
    data: user,
  };
};

exports.updateUser = async (id, data) => {
  if (!id) {
    return {
      statusCode: 400,
      message: 'User ID is required',
      data: null,
    };
  }
  const user = await updateUserById(id, data);
  if (!user) {
    return {
      statusCode: 404,
      message: 'User not found',
      data: null,
    };
  }
  return {
    statusCode: 200,
    message: 'User updated successfully',
    data: user,
  };
};

exports.updateProfile = async (id, data) => {
  const user = await getUserById(id);
  if (!user) {
    return {
      statusCode: 404,
      success: false,
      message: 'User not found',
      data: null,
    };
  }
  const updatedUser = await updateUserById(id, data);
  if (!updatedUser) {
    return {
      statusCode: 404,
      success: false,
      message: 'User not found',
      data: null,
    };
  }
  return {
    statusCode: 200,
    success: true,
    message: 'User profile updated successfully',
    data: updatedUser,
  };
};
