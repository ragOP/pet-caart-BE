const {
   getCart,
   updateCart,
   deleteCart,
   getAllAbondendCart,
   addToCartFromPreviousOrder,
} = require('../../services/cart/index.js');
const ApiResponse = require('../../utils/apiResponse/index.js');
const { asyncHandler } = require('../../utils/asyncHandler/index.js');

exports.getCart = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const cart = await getCart({
      user_id: _id,
      address_id: req.query.address_id,
      coupon_id: req.query.coupon_id,
   });

   if (!cart.success) {
      return res.json(new ApiResponse(cart.status, null, cart.message, false));
   }
   res.json(new ApiResponse(cart.status, cart.data, cart.message, true));
});

exports.addToCart = asyncHandler(async (req, res) => {
   const { product_id, quantity } = req.body;
   const { _id } = req.user;

   const cartItem = await updateCart(_id, product_id, quantity, req.body.variant_id);
   if (!cartItem.success) {
      return res.json(new ApiResponse(cartItem.status, null, cartItem.message, false));
   }
   return res.json(new ApiResponse(cartItem.status, cartItem.data, cartItem.message, true));
});

exports.deleteCart = asyncHandler(async (req, res) => {
   const { id } = req.params;

   const deletedCart = await deleteCart(id);
   if (!deletedCart.success) {
      return res.json(new ApiResponse(deletedCart.status, null, deletedCart.message, false));
   }
   return res.json(
      new ApiResponse(deletedCart.status, deletedCart.data, deletedCart.message, true)
   );
});

exports.handleGetAllAbondendCart = asyncHandler(async (req, res) => {
   const result = await getAllAbondendCart(req.user);
   if (!result.success) {
      return res
         .status(200)
         .json(new ApiResponse(result.statusCode, result.data, result.message, false));
   }
   return res
      .status(200)
      .json(new ApiResponse(result.statusCode, result.data, result.message, true));
});

exports.handleAddToCartFromPreviousOrder = asyncHandler(async (req, res) => {
   const { orderId } = req.body;
   const { _id } = req.user;
   const result = await addToCartFromPreviousOrder(_id, orderId);
   if (!result.success) {
      return res.json(new ApiResponse(result.status, null, result.message, false));
   }
   return res.json(new ApiResponse(result.status, result.data, result.message, true));
});
