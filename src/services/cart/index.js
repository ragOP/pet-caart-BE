const productModel = require('../../models/productModel.js');
const variantModel = require('../../models/variantModel.js');
const cartModel = require('../../models/cartModel.js');
const CartRepository = require('../../repositories/cart/index.js');
const { getOrderById } = require('../../controllers/orders/index.js');
const orderModel = require('../../models/orderModel.js');

exports.getCart = async ({ user_id, address_id, coupon_id, isUsingWalletAmount, couponName }) => {
   const cart = await CartRepository.getCartByUserId({
      user_id,
      address_id,
      coupon_id,
      isUsingWalletAmount,
      couponName,
   });
   if (!cart) {
      return {
         message: 'Cart not found',
         status: 404,
         success: false,
         data: null,
      };
   }
   return {
      message: cart.status === 400 ? cart.message : 'Cart fetched successfully',
      status: 200,
      success: true,
      data: cart.status === 400 ? cart.cart : cart,
   };
};

exports.updateCart = async (user_id, product_id, quantity, variant_id) => {
   let cart = await CartRepository.getCartForUser({ user_id });

   if (quantity < 0) {
      return {
         message: 'Invalid quantity',
         status: 400,
         success: false,
         data: null,
      };
   }

   const productData = await productModel.findById(product_id);

   if (!productData) {
      return {
         message: 'Product not found',
         status: 404,
         success: false,
         data: null,
      };
   }

   if (!variant_id && productData.stock < quantity) {
      return {
         message: 'Stock is not available',
         status: 400,
         success: false,
         data: null,
      };
   }

   let variantData = null;

   if (variant_id) {
      variantData = await variantModel.findById(variant_id);
      if (variantData.stock < quantity) {
         return {
            message: 'Stock is not available for this variant',
            status: 400,
            success: false,
            data: null,
         };
      }

      if (!variantData) {
         return {
            message: 'Variant not found',
            status: 404,
            success: false,
            data: null,
         };
      }
   }

   let productPrice = 0;
   let weight = 0;
   let mrp = 0;
   if (variantData) {
      productPrice = variantData.salePrice;
      weight = variantData.weight;
      totalMRP = variantData.price;
   } else {
      productPrice = productData.salePrice;
      weight = productData.weight;
      totalMRP = productData.price;
   }

   if (!cart) {
      if (quantity > 0) {
         cart = await CartRepository.addToCart({
            userId: user_id,
            items: [
               {
                  productId: product_id,
                  variantId: variantData ? variantData._id : null,
                  quantity,
                  price: productPrice,
                  total: productPrice * quantity,
                  addedAt: new Date(),
                  weight: weight,
                  totalMRP: totalMRP,
               },
            ],
            total_price: productPrice * quantity,
            totalMRP: totalMRP * quantity,
            is_active: true,
            isVariant: !!variant_id,
            selectedVariant: variant_id ? variant_id : null,
         });
      }
      cart = await cartModel.findOne({ userId: user_id }).populate({
         path: 'items.productId',
      });
      return {
         message: 'Cart created successfully',
         status: 201,
         success: true,
         data: cart,
      };
   }

   const existingItemIndex = cart.items.findIndex(
      item => item.productId._id.toString() === product_id
   );

   if (existingItemIndex !== -1) {
      if (quantity > 0) {
         cart.items[existingItemIndex].quantity = quantity;
         cart.items[existingItemIndex].price = productPrice;
         cart.items[existingItemIndex].total = productPrice * quantity;
         cart.items[existingItemIndex].weight = weight;
         cart.items[existingItemIndex].totalMRP = totalMRP * quantity;
         cart.items[existingItemIndex].variantId = variantData ? variantData._id : null;
      } else {
         cart.items.splice(existingItemIndex, 1);
      }
   } else if (quantity > 0) {
      cart.items.push({
         productId: product_id,
         quantity,
         price: productPrice,
         total: productPrice * quantity,
         totalMRP: totalMRP * quantity,
         variantId: variantData ? variantData._id : null,
         addedAt: new Date(),
         weight: weight,
      });
   }

   cart.total_price = cart.items.reduce((sum, item) => sum + item.total, 0);
   cart.is_active = cart.items.length > 0;
   cart.totalMRP = cart.items.reduce((sum, item) => sum + item.totalMRP, 0);
   cart.isVariant = !!variant_id;
   cart.selectedVariant = variant_id ? variant_id : null;

   await cart.save();

   cart = await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
   });

   return {
      message: 'Cart updated successfully',
      status: 200,
      success: true,
      data: cart,
   };
};

exports.deleteCart = async user_id => {
   const deletedCart = await CartRepository.deleteCartByUserId(user_id);
   if (!deletedCart) {
      return {
         message: 'Cart not found',
         status: 404,
         success: false,
         data: null,
      };
   }
   return {
      message: 'Cart deleted successfully',
      status: 200,
      success: true,
      data: deletedCart,
   };
};

exports.getAllAbondendCart = async () => {
   const query = {
      is_active: true,
      items: { $exists: true, $not: { $size: 0 } },
      updatedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24 hours ago
   };
   const carts = await CartRepository.getAllAbondendCarts(query);
   if (!carts) {
      return {
         message: 'No abandoned carts found',
         status: 404,
         success: false,
         data: null,
      };
   }
   return {
      message: 'Abandoned carts retrieved successfully',
      status: 200,
      success: true,
      data: carts,
   };
};

exports.addToCartFromPreviousOrder = async (user_id, orderId) => {
   const previousOrder = await orderModel.findOne({ _id: orderId, userId: user_id });
   if (!previousOrder) {
      return {
         message: 'Previous order not found',
         status: 404,
         success: false,
         data: null,
      };
   }
   let cart = await CartRepository.getCartForUser({ user_id });
   if (!cart) {
      cart = await CartRepository.addToCart({
         userId: user_id,
         items: [],
         total_price: 0,
         is_active: true,
      });
   }
   for (const item of previousOrder.items) {
      const productData = await productModel.findById(item.productId);
      if (!productData) {
         continue;
      }
      let variantData = null;
      if (item.variantId) {
         variantData = await variantModel.findById(item.variantId);
         if (!variantData) {
            continue;
         }
      }
      const existingItemIndex = cart.items.findIndex(
         cartItem => cartItem.productId.toString() === item.productId.toString()
      );
      const productPrice = variantData ? variantData.salePrice : productData.salePrice;
      const weight = variantData ? variantData.weight : productData.weight;
      if (existingItemIndex !== -1) {
         cart.items[existingItemIndex].quantity += item.quantity;
         cart.items[existingItemIndex].total =
            cart.items[existingItemIndex].quantity * productPrice;
         cart.items[existingItemIndex].price = productPrice;
         cart.items[existingItemIndex].weight = weight;
         cart.items[existingItemIndex].totalMRP = totalMRP * cart.items[existingItemIndex].quantity;
         cart.items[existingItemIndex].variantId = variantData ? variantData._id : null;
      } else {
         cart.items.push({
            productId: item.productId,
            quantity: item.quantity,
            price: productPrice,
            total: productPrice * item.quantity,
            totalMRP: totalMRP * item.quantity,
            variantId: variantData ? variantData._id : null,
            addedAt: new Date(),
            weight: weight,
         });
      }
   }
   await cart.save();
   return {
      message: 'Items added to cart successfully',
      status: 200,
      success: true,
      data: cart,
   };
};
