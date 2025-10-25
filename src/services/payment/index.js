const razorpay = require('../../config/razorpay');
const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
const { getUsableWalletAmount } = require('../../utils/get_usable_wallet_amount');
const { getTaxForItem } = require('../../utils/getTaxRate');
const { getEstimatedPrice } = require('../../utils/shipRocket');
const { validateId } = require('../../utils/validateId');

exports.createPaymentService = async (payload, user, isUsingWalletAmount) => {
   const { cartId, addressId, couponId, couponName } = payload;

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

   const cart = await cartModel.findById(cartId).populate({ path: 'items.productId' });

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

   const pincode = address.zip;

   let weight = 0;
   cart.items.forEach(item => {
      weight += item.weight * item.quantity;
   });

   weight = weight / 1000;

   const estimatedPrice = await getEstimatedPrice(pincode, weight);
   const shippingDetails = estimatedPrice.data.data.available_courier_companies;

   const shippingCost =
      shippingDetails[0].rate +
      shippingDetails[0].coverage_charges +
      shippingDetails[0].other_charges;

   let subtotal = 0;
   let discountAmount = 0;
   const updatedItems = [];

   cart.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      updatedItems.push({
         ...item.toObject(),
         discounted_price: item.price,
      });
   });

   if (couponId || couponName) {
      const coupon = await Coupon.findOne({
         $or: [{ _id: couponId }, { name: couponName }]
      });
      const now = new Date();

      if (!coupon) {
         return {
            message: 'Coupon not found',
            status: 400,
            success: false,
            cart,
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
               cart,
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
            cart,
         };
      }
   }

   let total = 0;
   updatedItems.forEach(item => {
      const quantity = item.quantity;
      const baseAmount = item.discounted_price * quantity;
      total += baseAmount;
   });

   let walletDiscount = 0;

   if (isUsingWalletAmount) {
      const walletAmount = user.walletBalance || 0;
      const applicableWalletAmount = getUsableWalletAmount(subtotal + discountAmount, walletAmount);
      walletDiscount = applicableWalletAmount;
   }

   const finalAmount = Math.round(((total + Math.min(shippingCost, 150)) - walletDiscount) * 100);

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
