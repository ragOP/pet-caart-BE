const { asyncHandler } = require('../../utils/asyncHandler');
const NewLetterList = require('../../models/newLetterList');
const ApiResponse = require('../../utils/apiResponse');

exports.handleSubscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const existingUser = await NewLetterList.findOne({ email });
  if (existingUser) {
    return res.status(400).json(new ApiResponse(400, 'User already exists', null, false));
  }
  const newLetterList = await NewLetterList.create({ email, name });
  return res.status(201).json(new ApiResponse(201, 'Subscribed successfully', newLetterList, true));
});

exports.handleUnsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const newLetterList = await NewLetterList.findOneAndUpdate({ email }, { isActive: false });
  return res
    .status(200)
    .json(new ApiResponse(200, 'Unsubscribed successfully', newLetterList, true));
});

exports.handleGetAllSubscribers = asyncHandler(async (req, res) => {
  const newLetterList = await NewLetterList.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, 'Subscribers fetched successfully', newLetterList, true));
});
