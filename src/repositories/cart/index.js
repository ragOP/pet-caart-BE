const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
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

exports.getCartByUserId = async ({ user_id, address_id, coupon_id }) => {
  if (!user_id) {
    return {
      message: 'User ID is required',
      status: 400,
      success: false,
      data: null,
    };
  }

  const cart = await cartModel
    .findOne({ userId: user_id })
    .populate({
      path: 'items.productId',
      populate: { path: 'hsnCode' },
    })
    .populate({
      path: 'items.variantId',
      populate: { path: 'productId' },
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
    state = address.state_code;
  }

  // 1. Base subtotal
  let subtotal = 0;
  const updatedItems = cart.items.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return {
      ...item.toObject(),
      discounted_price: item.price,
      quantity: item.quantity,
    };
  });

  // 2. Apply coupon
  if (coupon_id) {
    const coupon = await Coupon.findById(coupon_id);
    const now = new Date();

    if (!coupon) {
      return {
        message: 'Coupon not found',
        status: 404,
        success: false,
        data: null,
      };
    }

    if (
      coupon.active &&
      coupon.startDate <= now &&
      coupon.endDate >= now &&
      coupon.totalUseLimit > 0
    ) {
      if (subtotal < coupon.minPurchase) {
        return {
          message: 'Minimum purchase amount is not met',
          status: 400,
          success: false,
          data: null,
        };
      }

      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      // Distribute discount proportionally
      const ratio = discountAmount / subtotal;
      updatedItems.forEach(item => {
        const totalItemPrice = item.price * item.quantity;
        const discountedTotal = totalItemPrice - totalItemPrice * ratio;
        const perUnit = discountedTotal / item.quantity;
        item.discounted_price = parseFloat(perUnit.toFixed(2));
      });

      subtotal -= discountAmount;
    } else {
      return {
        message: 'Coupon is expired or inactive',
        status: 400,
        success: false,
        data: null,
      };
    }
  }

  // 3. Tax calculation on discounted prices
  let total = 0;
  const finalItems = updatedItems.map(item => {
    const hsn = item.productId.hsnCode;
    const quantity = item.quantity;
    const { cgst, sgst, igst, totalTax, cess } = getTaxForItem(
      item.discounted_price,
      hsn,
      state,
      quantity
    );

    const baseAmount = item.discounted_price * quantity;
    const total_price = parseFloat((baseAmount + totalTax).toFixed(2));
    total += total_price;

    return {
      ...item,
      cgst,
      sgst,
      igst,
      cess,
      total_price,
    };
  });

  return {
    ...cart.toObject(),
    items: finalItems,
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
