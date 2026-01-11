const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  dressid: { type: Number, required: true, unique: true },
  dressName: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  size: { type: String, required: true },
  description: { type: String, required: true },
  fabricDetail: { type: String },

  price: { type: Number, required: true },

  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
