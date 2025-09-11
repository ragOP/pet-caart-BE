const reviewModel = require('../../models/reviewModel');
const orderModel = require('../../models/orderModel');

exports.createReview = async (productId, userId, review, rating) => {
   console.log(productId, userId, review, rating, 'productId, userId, review, rating');
   const ifUserAlreadyBought = await orderModel.findOne({
      userId,
      'items.productId': { $in: [productId] },
      status: 'delivered',
   });
   console.log(ifUserAlreadyBought, 'ifUserAlreadyBought');
   if (!ifUserAlreadyBought) {
      return {
         statusCode: 400,
         data: null,
         message: 'User not bought the product',
         success: false,
      };
   }
   const reviewData = await reviewModel.create({
      productId,
      userId,
      review,
      rating,
      orderId: ifUserAlreadyBought._id,
   });

   if (!reviewData) {
      return {
         statusCode: 400,
         data: null,
         message: 'Review not created',
         success: false,
      };
   }

   return {
      statusCode: 200,
      data: reviewData,
      message: 'Review created successfully',
      success: true,
   };
};

exports.getAllProductReviews = async (productId, sortBy) => {
   const filter = { productId };

   let sort = {};
   if (sortBy === 'LTH') sort = { createdAt: 1 };
   else if (sortBy === 'HTL') sort = { createdAt: -1 };
   else if (sortBy === 'HTR') sort = { rating: -1 };
   else if (sortBy === 'LTR') sort = { rating: 1 };
   else sort = { rating: -1 };

   const reviews = await reviewModel
      .find(filter)
      .sort(sort)
      .populate('userId', 'name')
      .populate('orderId', 'address.state address.city')
      .limit(8);
   if (!reviews) {
      return {
         statusCode: 400,
         data: null,
         message: 'Reviews not found',
         success: false,
      };
   }
   const totalReviews = await reviewModel.countDocuments({ productId });
   const totalFiveStar = await reviewModel.countDocuments({ productId, rating: 5 });
   const totalFourStar = await reviewModel.countDocuments({ productId, rating: 4 });
   const totalThreeStar = await reviewModel.countDocuments({ productId, rating: 3 });
   const totalTwoStar = await reviewModel.countDocuments({ productId, rating: 2 });
   const totalOneStar = await reviewModel.countDocuments({ productId, rating: 1 });

   const finalData = {
      reviews,
      totalReviews,
      totalFiveStar,
      totalFourStar,
      totalThreeStar,
      totalTwoStar,
      totalOneStar,
   };

   return {
      statusCode: 200,
      data: finalData,
      message: 'Reviews fetched successfully',
      success: true,
   };
};

exports.checkIfUserBoughtProduct = async (productId, userId) => {
   const ifUserAlreadyBought = await orderModel.findOne({
      userId,
      'items.productId': { $in: [productId] },
      status: 'delivered',
   });
   if (!ifUserAlreadyBought) {
      return {
         statusCode: 400,
         data: null,
         message: 'User not bought the product',
         success: false,
      };
   }
   return {
      statusCode: 200,
      data: ifUserAlreadyBought,
      message: 'User bought the product',
      success: true,
   };
};
