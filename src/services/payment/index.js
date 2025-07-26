const razorpay = require('../../config/razorpay');
const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
const { getTaxForItem } = require('../../utils/getTaxRate');
const { validateId } = require('../../utils/validateId');

exports.createPaymentService = async (payload, user) => {
  const { cartId, addressId, couponId } = payload;

  if (!cartId || !addressId) {
    return {
      statusCode: 400,
      data: null,
      success: false,
      message: 'Invalid request',
    };
  }

  for (const [id, name] of [
    [cartId, 'Cart'],
    [addressId, 'Address'],
    [couponId, 'Coupon'],
  ]) {
    const validation = validateId(id, name);
    if (validation && !validation.success) return validation;
  }

  const cart = await cartModel
    .findById(cartId)
    .populate({ path: 'items.productId', populate: { path: 'hsnCode' } });

  if (!cart || cart.items.length === 0 || cart.items.some(item => item.quantity === 0)) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'Cart not found or empty',
    };
  }

  const address = await addressModel.findById(addressId);
  if (!address) {
    return {
      statusCode: 404,
      success: false,
      message: 'Address not found',
      data: null,
    };
  }

  const state = address.state_code;

  let subtotal = 0;
  let discountAmount = 0;
  let couponCode = '';
  const updatedItems = [];

  cart.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    updatedItems.push({
      ...item.toObject(),
      discounted_price: item.price,
    });
  });

  if (couponId) {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return {
        status: 404,
        success: false,
        message: 'Coupon not found',
        data: null,
      };
    }

    const now = new Date();
    if (
      !coupon.active ||
      coupon.startDate > now ||
      coupon.endDate < now ||
      coupon.totalUseLimit <= 0
    ) {
      return {
        status: 400,
        success: false,
        message: 'Coupon is expired or inactive',
        data: null,
      };
    }

    if (subtotal < coupon.minPurchase) {
      return {
        status: 400,
        success: false,
        message: 'Minimum purchase amount not met',
        data: null,
      };
    }

    couponCode = coupon.code;
    discountAmount =
      coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }

    const ratio = discountAmount / subtotal;
    updatedItems.forEach(item => {
      const totalItemPrice = item.price * item.quantity;
      const discountedTotal = totalItemPrice * (1 - ratio);
      const perUnit = discountedTotal / item.quantity;
      item.discounted_price = parseFloat(perUnit.toFixed(2));
    });

    subtotal -= discountAmount;
  }

  let total = 0;
  updatedItems.forEach(item => {
    const hsn = item.productId.hsnCode;
    const quantity = item.quantity;
    const { totalTax } = getTaxForItem(item.discounted_price, hsn, state, quantity);
    const baseAmount = item.discounted_price * quantity;
    total += baseAmount + totalTax;
  });

  const finalAmount = Math.round(total * 100);

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1,
  });

  return {
    statusCode: 200,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      signature: razorpayOrder.signature,
    },
    success: true,
    message: 'Payment created successfully',
  };
};
