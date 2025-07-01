const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');

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
  if (user_id && !address_id) {
    const cart = await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
      populate: { path: 'hsnCode' },
    });
    const cartResult = {
      ...cart.toObject(),
      items: cart.items.map(item => ({
        ...item.toObject(),
        cgst: 0,
        sgst: 0,
        igst: 0,
        total_price: item.price * item.quantity,
      })),
      total_price: cart.total_price,
      is_active: cart.is_active,
    };
    return cartResult;
  }
  if (user_id && address_id) {
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

    const cartResult = {
      ...cart.toObject(),
      items: cart.items.map(item => ({
        ...item.toObject(),
        cgst: 0,
        sgst: 0,
        igst: 0,
      })),
      total_price: cart.total_price,
      is_active: cart.is_active,
    };

    // Tax Calculation for the cart
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
      for (const item of cartResult.items) {
        if (address.state === 'Gujarat') {
          item.cgst = (item.price * item.productId.hsnCode.cgst_rate) / 100;
          item.sgst = (item.price * item.productId.hsnCode.sgst_rate) / 100;
          item.igst = null;
          item.total_price = parseFloat((item.price + item.cgst + item.sgst).toFixed(2));
        } else {
          item.igst = (item.price * item.productId.hsnCode.igst_rate) / 100;
          item.cgst = null;
          item.sgst = null;
          item.total_price = parseFloat((item.price + item.igst).toFixed(2));
        }
        cartResult.total_price += item.total_price;
      }
    }
    return cartResult;
  }
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
