const mongoose = require('mongoose'); // Librería para manejar MongoDB

// Definición del esquema de solicitudes de cambio
const exchangeRequestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  monedaOrigen: { type: String, required: true },
  monedaDestino: { type: String, required: true },
  monto: { type: Number, required: true },
  montoCambiado: { type: Number, required: true },
  tipoCambio: { type: Number, required: true },
  fecha: { type: Date, required: true },
});

// Crear el modelo de solicitudes de cambio basado en el esquema
const ExchangeRequest = mongoose.model('ExchangeRequest', exchangeRequestSchema);
module.exports = { ExchangeRequest };