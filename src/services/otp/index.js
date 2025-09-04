const { sendOtpFast2SMS } = require('../../utils/fast2sms');
const otpModel = require('../../models/otpModel');
const userModel = require('../../models/userModel');

exports.sendOtp = async (phoneNumber, origin) => {
  // const existingUser = await userModel.findOne({ phoneNumber });
  // if (origin === 'login') {
  //   if (!existingUser) {
  //     return {
  //       statusCode: 400,
  //       message: 'User not found, Please signup first',
  //       data: null,
  //       success: false,
  //     };
  //   }
  // }
  // if (origin === 'register') {
  //   if (existingUser) {
  //     return {
  //       statusCode: 400,
  //       message: 'User already exists, Please login',
  //       data: null,
  //       success: false,
  //     };
  //   }
  // }
  const existingOtp = await otpModel.findOne({ phoneNumber });
  if (existingOtp) {
    const timeDiff = (Date.now() - new Date(existingOtp.requestedAt).getTime()) / 1000;
    if (timeDiff < 60) {
      return {
        statusCode: 400,
        message: 'You can only request an OTP once every 60 seconds',
        data: null,
        success: false,
      };
    }
  }
  const otp = Math.floor(100000 + Math.random() * 900000);

  const result = {
    statusCode: 200,
    message: 'OTP sent successfully',
    data: otp,
  };
  // const result = await sendOtpFast2SMS(phoneNumber, otp);
  if (result.statusCode === 200) {
    if (existingOtp) {
      await otpModel.deleteOne({ _id: existingOtp._id });
    }
    await otpModel.create({ phoneNumber, otp });
    return {
      statusCode: 200,
      message: 'OTP sent successfully',
      data: result,
      success: true,
    };
  }
  return {
    statusCode: 500,
    message: 'Failed to send SMS',
    data: null,
    success: false,
  };
};
