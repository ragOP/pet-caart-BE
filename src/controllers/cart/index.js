const { getCart, updateCart, deleteCart } = require('../../services/cart/index.js');
const ApiResponse = require('../../utils/apiResponse/index.js');
const { asyncHandler } = require('../../utils/asyncHandler/index.js');

exports.getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const cart = await getCart({ user_id: _id, address_id: req.query.address_id });

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

  await deleteCart(id);
  res.json(new ApiResponse(200, null, 'Cart deleted successfully', true));
});
