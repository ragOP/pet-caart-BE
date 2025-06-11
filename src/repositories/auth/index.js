const User = require('../../models/userModel');

exports.checkUserExists = async phoneNumber => {
  const user = await User.findOne({ phoneNumber });
  if (user) return user;
  return null;
};

exports.createUser = async phoneNumber => {
  const newUser = await User.create({ phoneNumber });
  return newUser;
};

exports.getFilteredUsers = async (filters, skip, limit) => {
  const [users, total] = await Promise.all([
    User.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filters),
  ]);

  return { users, total };
};

