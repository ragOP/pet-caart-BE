const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');

exports.getCart = async () => {
  return await Cart.find({});
};

exports.getCartByUserId = async ({ user_id, address_id }) => {
  if (user_id && !address_id) {
    return await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
      populate: { path: 'hsnCode' },
    });
  }
  if (user_id && address_id) {
    const cart = await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
      populate: { path: 'hsnCode' },
    });
    console.log('cart', cart.items[0].productId.hsnCode);
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
        console.log('item', item.productId);
        // if (address.state === 'Gujarat') {
        //   item.productId.cgst = item.price * item.productId.hsnCode.cgst;
        //   item.productId.sgst = item.price * item.productId.hsnCode.sgst;
        // } else {
        //   item.productId.igst = item.price * item.productId.hsnCode.igst;
        // }
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
