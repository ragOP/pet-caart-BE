const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const { getTaxForItem } = require('../../utils/getTaxRate');

exports.getCart = async () => {
  return await Cart.find({});
};

exports.getCartForUser = async ({ user_id }) => {
  return await cartModel.findOne({ userId: user_id }).populate({
    path: 'items.productId',
    populate: { path: 'hsnCode' },
  });
};

exports.getCartByUserId = async ({ user_id, address_id }) => {
  if (!user_id) {
    return {
      message: 'User ID is required',
      status: 400,
      success: false,
      data: null,
    };
  }

  const cart = await cartModel.findOne({ userId: user_id }).populate({
    path: 'items.productId',
    populate: { path: 'hsnCode' },
  });

  if (!cart) {
    return {
      message: 'Cart not found',
      status: 404,
      success: false,
      data: null,
    };
  }

  let state = null;

  if (address_id) {
    const address = await addressModel.findById(address_id);
    if (!address) {
      return {
        message: 'Address not found',
        status: 404,
        success: false,
        data: null,
      };
    }
    state = address.state;
  }

  let total = 0;

  const updatedItems = cart.items.map(item => {
    const tax = getTaxForItem(item, state);
    total += tax.total_price;

    return {
      ...item.toObject(),
      ...tax,
    };
  });

  return {
    ...cart.toObject(),
    items: updatedItems,
    total_price: parseFloat(total.toFixed(2)),
    is_active: cart.is_active,
  };
};

exports.addToCart = async data => {
  return await cartModel.create(data);
};

exports.updateCartItem = async (id, data) => {
  return await cartModel.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCartByUserId = async id => {
  return await cartModel.deleteOne({ user: id });
};
