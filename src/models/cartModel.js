const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Variant',
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        isVariant: {
          type: Boolean,
          default: false,
        },
        selectedVariant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Variant',
        },
      },
    ],
    total_price: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate total for each item before saving
cartSchema.pre('save', function (next) {
  this.items.forEach(item => {
    const quantity = item.quantity || 0;
    const price = item.price || 0;
    item.total = quantity * price;
  });

  // calculate total_price for the cart
  const totalPrice = this.items.reduce((sum, item) => {
    const itemTotal = item.total || 0;
    return sum + itemTotal;
  }, 0);

  this.total_price = totalPrice;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
