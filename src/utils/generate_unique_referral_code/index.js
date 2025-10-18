const crypto = require('crypto');

exports.generateUniqueReferralCode = async userId => {
   const hash = crypto.createHash('md5').update(userId.toString()).digest('hex');
   return 'USR' + hash.substring(0, 6).toUpperCase();
};
