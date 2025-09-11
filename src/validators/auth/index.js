const { body } = require('express-validator');

exports.validateMobileAndOTP = [
   body('phoneNumber')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\d{10}$/)
      .withMessage('Phone number must be exactly 10 digits'),

   body('otp')
      .notEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits'),
];
