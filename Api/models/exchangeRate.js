const mongoose = require('mongoose'); // Librería para manejar MongoDB

// Definición del esquema de tipos de cambio
const exchangeRateSchema = new mongoose.Schema({
  compra: { type: Number, required: true },
  venta: { type: Number, required: true },
  origen: { type: String, required: true },
  moneda: { type: String, required: true },
  fecha: { type: Date, required: true },
});

// Crear el modelo de tipos de cambio basado en el esquema
const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);
module.exports = { ExchangeRate };