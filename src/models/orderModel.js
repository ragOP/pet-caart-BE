const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  taxAmount: { type: Number, required: true },
  cessAmount: { type: Number, required: true },
  couponDiscount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const OrderAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  alternateMobile: { type: String },
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    address: OrderAddressSchema,
    paymentMethod: { type: String, required: true, default: 'cod', enum: ['cod', 'online'] },
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    },
    rawPrice: { type: Number, required: true },
    discountedAmount: { type: Number, required: true },
    discountedAmountAfterCoupon: { type: Number, required: true },
    amountAfterTax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
