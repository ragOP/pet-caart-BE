const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true 
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0,
    validate: {
      validator: function (v) {
        return !v || v < this.price;
      },
      message: "Sale price must be less than the regular price"
    }
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  images: {
    type: [String], 
    default: []
  },
  attributes: {
    type: Map,
    of: String,
    default: {} // e.g., { size: "L", color: "Red", flavor: "Chicken" }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Variant", VariantSchema);
