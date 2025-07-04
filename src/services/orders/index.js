const mongoose = require('mongoose');
const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
const orderModel = require('../../models/orderModel');
const { getTaxForItem } = require('../../utils/getTaxRate');
const productModel = require('../../models/productModel');
const variantModel = require('../../models/variantModel');
const transcationModel = require('../../models/transcationModel');

const validateId = (id, name) => {
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return {
      statusCode: 400,
      data: null,
      success: false,
      message: `Invalid ${name} ID`,
    };
  }
};

exports.createOrderService = async (payload, user) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { cartId, addressId, couponId, paymentMethod } = payload;
    const { _id } = user;

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
      .populate({
        path: 'items.productId',
        populate: { path: 'hsnCode' },
      })
      .session(session);

    if (!cart || cart.items.length === 0 || cart.items.some(item => item.quantity === 0)) {
      return {
        statusCode: 404,
        data: null,
        success: false,
        message: 'Cart not found or empty',
      };
    }

    const addressPayload = {};
    let state = null;
    if (addressId) {
      const address = await addressModel.findById(addressId).session(session);
      if (!address) {
        return {
          message: 'Address not found',
          status: 404,
          success: false,
          data: null,
        };
      }

      state = address.state_code;
      addressPayload.name = address.firstName + ' ' + address.lastName;
      addressPayload.mobile = address.phone;
      addressPayload.email = user.email || '';
      addressPayload.address = address.address;
      addressPayload.city = address.city;
      addressPayload.state = address.state;
      addressPayload.country = address.country;
      addressPayload.pincode = address.zip;
    }

    let subtotal = 0;
    let totalDiscountedAmount = 0;
    const updatedItems = cart.items.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return {
        ...item.toObject(),
        discounted_price: item.price,
        quantity: item.quantity,
      };
    });

    let discountAmount = 0;
    let couponCode = '';
    if (couponId) {
      const coupon = await Coupon.findById(couponId).session(session);
      couponCode = coupon?.code || '';
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

        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        const ratio = discountAmount / subtotal;
        updatedItems.forEach(item => {
          const totalItemPrice = item.price * item.quantity;
          const discountedTotal = totalItemPrice - totalItemPrice * ratio;
          const perUnit = discountedTotal / item.quantity;
          item.discounted_price = parseFloat(perUnit.toFixed(2));
        });

        totalDiscountedAmount = discountAmount;
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

    const orderItemPayload = finalItems.map(item => ({
      productId: item.productId._id,
      variantId: item.variantId,
      quantity: item.quantity,
      taxAmount: item.igst ? item.igst : item.cgst + item.sgst,
      cessAmount: item.cess,
      couponDiscount: item.discounted_price,
      price: item.price,
      total: item.total_price,
    }));

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const orderPayload = {
      orderId,
      userId: _id,
      items: orderItemPayload,
      address: addressPayload,
      paymentMethod,
      status: 'pending',
      rawPrice: subtotal + totalDiscountedAmount,
      discountedAmount: totalDiscountedAmount,
      discountedAmountAfterCoupon: subtotal,
      amountAfterTax: total,
      totalAmount: total,
      couponCode: couponCode,
      note: payload.note || '',
    };

    const order = await orderModel.create([orderPayload], { session });
    if (!order || !order[0]) {
      return {
        statusCode: 500,
        data: null,
        success: false,
        message: 'Failed to create order',
      };
    }

    // Decrement coupon use limit
    if (couponId) {
      await Coupon.findByIdAndUpdate(couponId, { $inc: { totalUseLimit: -1 } }, { session });
    }

    if (cart.isVariant) {
      await variantModel.updateMany(
        {
          _id: { $in: finalItems.map(item => item.selectedVariant) },
        },
        {
          $inc: {
            stock: -finalItems.reduce((acc, item) => acc + item.quantity, 0),
          },
        },
        { session }
      );
    } else {
      await productModel.updateMany(
        {
          _id: { $in: finalItems.map(item => item.productId) },
        },
        {
          $inc: {
            stock: -finalItems.reduce((acc, item) => acc + item.quantity, 0),
          },
        },
        { session }
      );
    }

    // Delete cart
    await cartModel.findByIdAndDelete(cartId, { session });

    // Create transcation
    if (paymentMethod === 'cod') {
      const transcationPayload = {
        orderId: order[0]._id,
        userId: _id,
        type: 'order',
        paymentMethod: 'cod',
        amount: total,
        status: 'pending',
        transactionId: null,
      };
      const transcation = await transcationModel.create([transcationPayload], { session });
      if (!transcation || !transcation[0]) {
        return {
          statusCode: 500,
          data: null,
          success: false,
          message: 'Failed to create transcation',
        };
      }
    }
    await session.commitTransaction();
    session.endSession();

    // TODO: Send email to user about order success

    return {
      statusCode: 201,
      data: order[0],
      success: true,
      message: 'Order created successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return {
      statusCode: 500,
      data: null,
      success: false,
      message: error.message || 'Transaction failed',
    };
  }
};

exports.getOrderByIdService = async (id, user) => {
  const { _id } = user;

  const order = await orderModel
    .findById(id)
    .populate('items.productId')
    .populate('items.variantId');
  if (!order) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'Order not found',
    };
  }

  if (order.userId.toString() !== _id.toString()) {
    return {
      statusCode: 403,
      data: null,
      success: false,
      message: 'Unauthorized',
    };
  }

  return {
    statusCode: 200,
    data: order,
    success: true,
    message: 'Order retrieved successfully',
  };
};

exports.getAllUserOrdersService = async user => {
  const { _id } = user;

  const orders = await orderModel
    .find({ userId: _id })
    .populate('items.productId')
    .populate('items.variantId');
  if (!orders || orders.length === 0) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'No orders found',
    };
  }

  return {
    statusCode: 200,
    data: orders,
    success: true,
    message: 'Orders retrieved successfully',
  };
};

exports.getAllOrdersService = async (
  page,
  limit,
  search,
  sort,
  order,
  status,
  startDate,
  endDate
) => {
  const query = {};
  if (search) {
    query.orderId = { $regex: search, $options: 'i' };
  }
  if (status) {
    query.status = status;
  }
  if (startDate && endDate) {
    query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  if (sort && order) {
    query[sort] = order;
  }
  const skip = (page - 1) * limit;
  const orders = await orderModel
    .find(query)
    .populate('items.productId')
    .populate('items.variantId')
    .skip(skip)
    .limit(limit);
  const total = await orderModel.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  if (!orders || orders.length === 0) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'No orders found',
    };
  }
  return {
    statusCode: 200,
    data: {
      orders,
      totalPages,
      total,
      currentPage: page,
    },
    success: true,
    message: 'Orders retrieved successfully',
  };
};

exports.getOrderByIdServiceAdmin = async id => {
  const order = await orderModel
    .findById(id)
    .populate('items.productId')
    .populate('items.variantId');
  if (!order) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'Order not found',
    };
  }
  return {
    statusCode: 200,
    data: order,
    success: true,
    message: 'Order retrieved successfully',
  };
};

exports.updateOrderStatusService = async (id, payload) => {
  const { status } = payload;
  const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) {
    return {
      statusCode: 404,
      data: null,
      success: false,
      message: 'Order not found',
    };
  }
  return {
    statusCode: 200,
    data: order,
    success: true,
    message: 'Order status updated successfully',
  };
};