const addressModel = require('../../models/addressModel');
const cartModel = require('../../models/cartModel');
const Coupon = require('../../models/couponModel');
const userModel = require('../../models/userModel');
const { getUsableWalletAmount } = require('../../utils/get_usable_wallet_amount');
const { getTaxForItem } = require('../../utils/getTaxRate');
const { getEstimatedPrice } = require('../../utils/shipRocket');

exports.getCart = async () => {
   return await Cart.find({});
};

exports.getCartForUser = async ({ user_id }) => {
   return await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
   });
};

exports.getCartByUserId = async ({ user_id, address_id, coupon_id, isUsingWalletAmount, couponName }) => {
   if (!user_id) {
      return {
         message: 'User ID is required',
         status: 400,
         success: false,
         cart: null,
      };
   }

   const user = await userModel.findById(user_id);

   const cart = await cartModel
      .findOne({ userId: user_id })
      .populate({
         path: 'items.productId',
      })
      .populate({
         path: 'items.variantId',
      });

   if (!cart) {
      return {
         message: 'Cart not found',
         status: 404,
         success: false,
         cart: null,
      };
   }

   let pincode = null;
   if (address_id) {
      const address = await addressModel.findById(address_id);
      if (!address) {
         return {
            message: 'Address not found',
            status: 400,
            success: false,
            cart,
         };
      }
      state = address.state_code;
      pincode = address.zip;
   }

   let weight = 0;
   cart.items.forEach(item => {
      weight += item.weight * item.quantity;
   });

   weight = weight / 1000;

   let shippingDetails = {};
   if (pincode) {
      const estimatedPrice = await getEstimatedPrice(pincode, weight);
      const couriers = estimatedPrice.data.data.available_courier_companies;

      shippingDetails = {
         name: couriers[0].courier_name,
         totalCost: couriers[0].rate + couriers[0].coverage_charges + couriers[0].other_charges,
         estimatedDays: couriers[0].estimated_delivery_days,
         estimatedDate: couriers[0].etd,
      };
   }

   // 1. Base subtotal
   let discountAmount = 0;
   let subtotal = 0;
   let totalMRP = 0;
   const updatedItems = cart.items.map(item => {
      const itemTotal = item.price * item.quantity;
      totalMRP += item.totalMRP;
      subtotal += itemTotal;
      return {
         ...item.toObject(),
         discounted_price: item.price,
         quantity: item.quantity,
         totalMRP: item.totalMRP,
      };
   });

   // 2. Apply coupon
   if (coupon_id || couponName) {
      const coupon = await Coupon.findOne({
         $or: [{ _id: coupon_id }, { code: couponName }]
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
               cart: {
                  ...cart.toObject(),
                  items: updatedItems,
                  discount_amount: 0,
                  total_price_with_shipping_and_discount:
                     subtotal + Math.min(shippingDetails.totalCost, 150),
                  is_active: cart.is_active,
                  shippingDetails,
               },
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
            cart: {
               ...cart.toObject(),
               items: updatedItems,
               discount_amount: 0,
               total_price_with_shipping_and_discount:
                  subtotal + Math.min(shippingDetails.totalCost, 150),
               is_active: cart.is_active,
               shippingDetails,
            },
         };
      }
   }

   let walletDiscount = 0;

   if (isUsingWalletAmount) {
      const walletAmount = user.walletBalance || 0;
      const applicableWalletAmount = getUsableWalletAmount(subtotal, walletAmount);
      walletDiscount = applicableWalletAmount;
   }

   const shippingCost = shippingDetails?.totalCost ?? 0;
   const total = subtotal !== 0 ? subtotal + Math.min(shippingCost || 0, 150) : 0;
   shippingDetails.totalCost = subtotal !== 0 ? Math.min(shippingCost || 0, 150) : 0;
   shippingDetails.estimatedDays = Math.min(shippingDetails.estimatedDays, 4);

   return {
      ...cart.toObject(),
      items: updatedItems,
      discount_amount: discountAmount,
      total_price_with_shipping_and_discount: parseFloat(
         total.toFixed(2) - walletDiscount.toFixed(2)
      ),
      is_active: cart.is_active,
      totalMRP: totalMRP,
      shippingDetails,
      walletDiscount: Number(walletDiscount.toFixed(2)),
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

exports.getAllAbondendCarts = async query => {
   return await cartModel
      .find(query)
      .populate('userId')
      .populate('items.productId')
      .populate('items.variantId');
};
