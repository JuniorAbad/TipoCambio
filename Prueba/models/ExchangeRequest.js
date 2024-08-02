const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  monedaOrigen: String,
  monedaDestino: String,
  monto: Number,
  montoCambiado: Number,
  tipoCambio: Number,
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);