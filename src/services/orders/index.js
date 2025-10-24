const mongoose = require('mongoose');
const crypto = require('crypto');
const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
const orderModel = require('../../models/orderModel');
const { getTaxForItem } = require('../../utils/getTaxRate');
const productModel = require('../../models/productModel');
const variantModel = require('../../models/variantModel');
const transcationModel = require('../../models/transcationModel');
const { validateId } = require('../../utils/validateId');
const {
   createOrder,
   generateShiprocketPickup,
   getEstimatedPrice,
} = require('../../utils/shipRocket');
const { generateOrderBill } = require('../../utils/generateOrderBill');
const { getUsableWalletAmount } = require('../../utils/get_usable_wallet_amount');
const walletModel = require('../../models/walletModel');

exports.createOrderService = async (payload, user, isUsingWallet) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
      const { cartId, addressId, couponId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
         payload;
      const { _id } = user;

      if (!cartId || !addressId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
         await session.abortTransaction();
         session.endSession();
         return {
            statusCode: 400,
            data: null,
            success: false,
            message: 'Invalid request',
         };
      }

      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
      hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
         await session.abortTransaction();
         session.endSession();
         return {
            statusCode: 400,
            data: null,
            success: false,
            message: 'Invalid signature',
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
         })
         .session(session);

      if (!cart || cart.items.length === 0 || cart.items.some(item => item.quantity === 0)) {
         await session.abortTransaction();
         session.endSession();
         return {
            statusCode: 404,
            data: null,
            success: false,
            message: 'Cart not found or empty',
         };
      }

      const addressPayload = {};
      let pincode = null;
      if (addressId) {
         const address = await addressModel.findById(addressId).session(session);
         if (!address) {
            await session.abortTransaction();
            session.endSession();
            return {
               message: 'Address not found',
               statusCode: 404,
               success: false,
               data: null,
            };
         }
         addressPayload.name = address.firstName + ' ' + address.lastName;
         addressPayload.mobile = address.phone;
         addressPayload.email = user.email || '';
         addressPayload.address = address.address;
         addressPayload.city = address.city;
         addressPayload.state = address.state;
         addressPayload.country = address.country;
         addressPayload.pincode = address.zip;
         pincode = address.zip;
      }

      let weight = 0;
      cart.items.forEach(item => {
         weight += item.weight * item.quantity;
      });

      weight = weight / 1000;

      let shippingCost = 0;
      if (pincode) {
         const estimatedPrice = await getEstimatedPrice(pincode, weight);
         const couriers = estimatedPrice.data.data.available_courier_companies;

         shippingCost = couriers[0].rate + couriers[0].coverage_charges + couriers[0].other_charges;
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
            total_price: itemTotal,
         };
      });

      let discountAmount = 0;
      let couponCode = '';
      if (couponId) {
         const coupon = await Coupon.findById(couponId).session(session);
         couponCode = coupon?.code || '';
         const now = new Date();

         if (!coupon) {
            await session.abortTransaction();
            session.endSession();
            return {
               message: 'Coupon not found',
               statusCode: 404,
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
               item.total_price = parseFloat(discountedTotal.toFixed(2));
            });

            totalDiscountedAmount = discountAmount;
            subtotal -= discountAmount;
         } else {
            await session.abortTransaction();
            session.endSession();
            return {
               message: 'Coupon is expired or inactive',
               statusCode: 400,
               success: false,
               data: null,
            };
         }
      }

      let walletDiscount = 0;
      if (isUsingWallet) {
         const totalWalletBalance = user.walletBalance || 0;
         const applicableWalletAmount = getUsableWalletAmount(
            subtotal + totalDiscountedAmount,
            totalWalletBalance
         );
         subtotal -= applicableWalletAmount;
         walletDiscount = applicableWalletAmount;

         // Deduct wallet amount from user
         const updatedWalletBalance = totalWalletBalance - applicableWalletAmount;

         // Create wallet transaction for debit
         await walletModel.create(
            [
               {
                  userId: user._id,
                  amount: applicableWalletAmount,
                  type: 'debit',
                  description: `Used wallet balance for order ${cartId}`,
               },
            ],
            { session }
         );

         await mongoose
            .model('User')
            .updateOne(
               { _id: user._id },
               { $set: { walletBalance: updatedWalletBalance } },
               { session }
            );
      }

      // 5% cashback on every order to wallet on total cart value
      const cashbackPercentage = 5;
      const cashbackAmount = ((subtotal + Math.min(shippingCost, 150)) * cashbackPercentage) / 100;

      if (cashbackAmount > 0) {
         // Create wallet transaction for cashback credit
         await walletModel.create(
            [
               {
                  userId: _id,
                  amount: cashbackAmount,
                  type: 'credit',
                  description: `Cashback for order ${orderId}`,
               },
            ],
            { session }
         );
      }

      const orderItemPayload = updatedItems.map(item => ({
         productId: item.productId._id,
         variantId: item.variantId,
         quantity: item.quantity,
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
         paymentMethod: 'razorpay',
         status: 'pending',
         rawPrice: subtotal + totalDiscountedAmount + walletDiscount,
         discountedAmount: totalDiscountedAmount,
         discountedAmountAfterCoupon: subtotal,
         totalAmount: subtotal + Math.min(shippingCost, 150),
         couponCode: couponCode,
         note: payload.note || '',
         weight: weight,
         walletDiscount: walletDiscount,
         shippingCharge: Math.min(shippingCost, 150),
         cashBackOnOrder: cashbackAmount,
      };

      const order = await orderModel.create([orderPayload], { session });
      if (!order || !order[0]) {
         await session.abortTransaction();
         session.endSession();
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
               _id: { $in: updatedItems.map(item => item.selectedVariant) },
            },
            {
               $inc: {
                  stock: -updatedItems.reduce((acc, item) => acc + item.quantity, 0),
               },
            },
            { session }
         );
      } else {
         await productModel.updateMany(
            {
               _id: { $in: updatedItems.map(item => item.productId) },
            },
            {
               $inc: {
                  stock: -updatedItems.reduce((acc, item) => acc + item.quantity, 0),
               },
            },
            { session }
         );
      }

      // Delete cart
      await cartModel.findByIdAndDelete(cartId, { session });

      // Update if it is user's first order
      if (!user.hasCompletedFirstOrder && user.referredBy) {
         const referralBonus = Math.max(Number(process.env.REFERRAL_BONUS_AMOUNT) || 0, 0);

         await mongoose
            .model('User')
            .updateOne({ _id: user._id }, { $set: { hasCompletedFirstOrder: true } }, { session });

         await mongoose
            .model('User')
            .updateOne(
               { _id: user.referredBy },
               { $inc: { walletBalance: referralBonus } },
               { session }
            );

         // Create wallet transaction for referral bonus for referrer
         await walletModel.create(
            [
               {
                  userId: user.referredBy,
                  amount: referralBonus,
                  type: 'credit',
                  description: `Referral bonus for referring user ${user.phoneNumber}`,
               },
            ],
            { session }
         );

         // Create wallet transaction for joining bonus for referee
         const reffreeBonus = Math.max(Number(process.env.REFFREE_BONUS_AMOUNT) || 0, 0);
         await mongoose
            .model('User')
            .updateOne({ _id: user._id }, { $inc: { walletBalance: reffreeBonus } }, { session });

         // Create wallet transaction for joining bonus for referee
         await walletModel.create(
            [
               {
                  userId: user._id,
                  amount: reffreeBonus,
                  type: 'credit',
                  description: `Joining bonus for completing first order`,
               },
            ],
            { session }
         );
      }

      // Create transcation
      const transcationPayload = {
         orderId: order[0]._id,
         razorpayOrderId,
         razorpayPaymentId,
         userId: _id,
         type: 'order',
         paymentMethod: 'razorpay',
         amount: subtotal + Math.min(shippingCost, 150),
         status: 'pending',
         transactionId: null,
      };
      const transcation = await transcationModel.create([transcationPayload], { session });
      if (!transcation || !transcation[0]) {
         await session.abortTransaction();
         session.endSession();
         return {
            statusCode: 500,
            data: null,
            success: false,
            message: 'Failed to create transcation',
         };
      }
      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      let emailSent = false;

      // const orderBill = await generateOrderBill(order[0], user, addressPayload);

      // if (orderBill.success) {
      //   emailSent = true;
      // }

      return {
         statusCode: 201,
         data: order[0],
         success: true,
         message: emailSent
            ? 'Order created successfully'
            : 'Order created successfully but email not sent',
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

   const transcations = await transcationModel.find({
      orderId: { $in: orders.map(order => order._id) },
   });
   const finalOrders = orders.map(order => {
      const transcation = transcations.find(
         transcation => transcation.orderId.toString() === order._id.toString()
      );
      return {
         ...order.toObject(),
         transcation,
      };
   });

   return {
      statusCode: 200,
      data: {
         orders: finalOrders,
      },
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
      .limit(limit)
      .sort({ createdAt: -1 });

   if (!orders || orders.length === 0) {
      return {
         statusCode: 404,
         data: null,
         success: false,
         message: 'No orders found',
      };
   }
   const total = await orderModel.countDocuments(query);
   const totalPages = Math.ceil(total / limit);

   const transcations = await transcationModel.find({
      orderId: { $in: orders.map(order => order._id) },
   });
   const finalOrders = orders.map(order => {
      const transcation = transcations.find(
         transcation => transcation.orderId.toString() === order._id.toString()
      );
      return {
         ...order.toObject(),
         transcation,
      };
   });

   return {
      statusCode: 200,
      data: {
         orders: finalOrders,
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
   const transcation = await transcationModel.findOne({ orderId: order._id });
   return {
      statusCode: 200,
      data: {
         ...order.toObject(),
         transcation,
      },
      success: true,
      message: 'Order retrieved successfully',
   };
};

exports.updateOrderStatusService = async (id, payload) => {
   const session = await mongoose.startSession();
   session.startTransaction();

   try {
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

      const transcation = await transcationModel.findOne({ orderId: order._id });

      if (status === 'confirmed' && order.shipRocketOrderId) {
         const generatePickup = await generateShiprocketPickup(order.shipRocketOrderId);
         if (!generatePickup.success) {
            await session.abortTransaction();
            session.endSession();
            return {
               statusCode: 500,
               data: {
                  ...order.toObject(),
                  transcation,
               },
               success: false,
               message: 'Failed to generate pickup',
            };
         }
      }
      await session.commitTransaction();
      session.endSession();

      return {
         statusCode: 200,
         data: {
            ...order.toObject(),
            transcation,
         },
         success: true,
         message: 'Order status updated successfully',
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

exports.createShipRocketOrderService = async (id, length, width, height) => {
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

   // Create Shiprocket order
   const shipRocketPayload = {
      order_id: order._id,
      order_date: new Date(order.createdAt).toISOString().slice(0, 16).replace('T', ' '),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

      billing_customer_name: order.address.name,
      billing_last_name: '',
      billing_address: order.address.address,
      billing_city: order.address.city,
      billing_pincode: order.address.pincode,
      billing_state: order.address.state,
      billing_country: order.address.country,
      billing_email: order.address.email,
      billing_phone: order.address.mobile,

      shipping_is_billing: true,
      channel_id: process.env.SHIPROCKET_CHANNEL_ID,

      order_items: order.items.map(item => ({
         name: item.productId.title || 'Product Name',
         sku: item?.variantId?.sku || item?.productId?._id?.toString(),
         units: item.quantity,
         selling_price: item.price,
         discount: item.couponDiscount || 0,
         tax: item.taxAmount || 0,
      })),

      payment_method: 'Prepaid',
      sub_total: order.rawPrice,
      total_discount: order.discountedAmountAfterCoupon,
      total: order.totalAmount.toFixed(2),
      weight: order.weight,
      length,
      breadth: width,
      height,
   };

   const shipRocketResponse = await createOrder(shipRocketPayload);
   if (shipRocketResponse.success) {
      await orderModel.findByIdAndUpdate(order._id, {
         shipRocketOrderId: shipRocketResponse.data.order_id,
      });
   } else {
      return {
         statusCode: 500,
         data: null,
         success: false,
         message: 'Failed to create shiprocket order',
      };
   }

   return {
      statusCode: 200,
      data: shipRocketResponse,
      success: true,
      message: 'Shiprocket order created successfully',
   };
};
