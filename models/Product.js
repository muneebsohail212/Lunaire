const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  dressid: { type: Number, required: true },
  dressName: { type: String, required: true },
  color: String,
  quantity: { type: Number, default: 0 },
  size: String,
  description: String,
  fabricDetail: String,
  price: { type: Number, required: true },
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
