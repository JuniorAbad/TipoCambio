const mongoose = require('mongoose');

const exchangeRateSchema = new mongoose.Schema({
  compra: Number,
  venta: Number,
  origen: String,
  moneda: String,
  fecha: Date,
});

module.exports = mongoose.model('ExchangeRate', exchangeRateSchema);