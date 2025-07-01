const { checkUserExists } = require('../../../repositories/auth/index');
const { OTP } = require('../../../constants/otp/index');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (phoneNumber, otp) => {
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

  if (user.role !== 'admin') {
    return {
      statusCode: 401,
      message: 'User is not an admin',
      data: null,
    };
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  return {
    statusCode: 200,
    message: 'Admin logged in successfully',
    data: {
      user,
      token,
    },
  };
};
