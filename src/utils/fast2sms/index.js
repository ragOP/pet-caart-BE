const axios = require('axios');

exports.sendOtpFast2SMS = async (phone, otp) => {
  const data = new URLSearchParams({
    sender_id: process.env.FAST2SMS_SENDER_ID,
    message: process.env.FAST2SMS_MESSAGE,
    variables_values: otp,
    route: process.env.FAST2SMS_ROUTE,
    numbers: phone,
  });

  const headers = {
    authorization: process.env.FAST2SMS_API_KEY,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const res = await axios.post('https://www.fast2sms.com/dev/bulkV2', data, { headers });
    return {
      statusCode: 200,
      success: true,
      data: res.data,
      message: 'OTP sent successfully',
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: 'Failed to send SMS',
      data: null,
      success: false,
    };
  }
};
