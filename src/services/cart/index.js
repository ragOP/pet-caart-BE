const productModel = require('../../models/productModel.js');
const variantModel = require('../../models/variantModel.js');
const cartModel = require('../../models/cartModel.js');
const CartRepository = require('../../repositories/cart/index.js');

exports.getCart = async ({ user_id, address_id, coupon_id }) => {
  const cart = await CartRepository.getCartByUserId({
    user_id,
    address_id,
    coupon_id,
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
    message: 'Cart fetched successfully',
    status: 200,
    success: true,
    data: cart,
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
  if (variantData) {
    productPrice = variantData.salePrice;
  } else {
    productPrice = productData.salePrice;
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
          },
        ],
        total_price: productPrice * quantity,
        is_active: true,
        isVariant: !!variant_id,
        selectedVariant: variant_id ? variant_id : null,
      });
    }
    cart = await cartModel.findOne({ userId: user_id }).populate({
      path: 'items.productId',
      populate: { path: 'hsnCode' },
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
    } else {
      cart.items.splice(existingItemIndex, 1);
    }
  } else if (quantity > 0) {
    cart.items.push({
      productId: product_id,
      quantity,
      price: productPrice,
      total: productPrice * quantity,
      variantId: variantData ? variantData._id : null,
      addedAt: new Date(),
    });
  }

  cart.total_price = cart.items.reduce((sum, item) => sum + item.total, 0);
  cart.is_active = cart.items.length > 0;
  cart.isVariant = !!variant_id;
  cart.selectedVariant = variant_id ? variant_id : null;

  await cart.save();

  cart = await cartModel.findOne({ userId: user_id }).populate({
    path: 'items.productId',
    populate: { path: 'hsnCode' },
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
