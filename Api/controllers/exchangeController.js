const { v4: uuidv4 } = require('uuid'); // Librería para generar identificadores únicos
const { ExchangeRequest } = require('../models/exchangeRequest'); // Modelo de Mongoose para solicitudes de cambio
const { ExchangeRate } = require('../models/exchangeRate'); // Modelo de Mongoose para el tipo de cambio

// Controlador para registrar una solicitud de cambio
const registerExchangeRequest = async (req, res) => {
  const { monedaOrigen, monedaDestino, monto } = req.body; // Obtener datos del cuerpo de la petición

  try {
    // Obtener el último tipo de cambio guardado
    const latestRate = await ExchangeRate.findOne().sort({ fecha: -1 });

    if (!latestRate) {
      return res.status(500).json({ message: 'No se encontró el tipo de cambio.' }); // Respuesta de error si no hay tipo de cambio
    }

    let tipoCambio, montoCambiado;
    // Calcular el monto cambiado basado en el tipo de cambio
    if (monedaOrigen === 'USD' && monedaDestino === 'PEN') {
      tipoCambio = latestRate.compra;
      montoCambiado = monto * tipoCambio;
    } else if (monedaOrigen === 'PEN' && monedaDestino === 'USD') {
      tipoCambio = latestRate.venta;
      montoCambiado = monto / tipoCambio;
    } else {
      return res.status(400).json({ message: 'Monedas no soportadas.' }); // Respuesta de error si las monedas no son soportadas
    }

    // Crear una nueva solicitud de cambio
    const newRequest = new ExchangeRequest({
      id: uuidv4(), // Generar un identificador único
      monedaOrigen,
      monedaDestino,
      monto,
      montoCambiado,
      tipoCambio,
      fecha: new Date(), // Fecha actual
    });

    await newRequest.save(); // Guardar la solicitud en la base de datos
    res.status(201).json(newRequest); // Respuesta exitosa con la solicitud guardada
  } catch (error) {
    console.error('Error al registrar la solicitud de cambio:', error); // Log de error
    res.status(500).json({ message: 'Error interno del servidor.' }); // Respuesta de error
  }
};

// Controlador para obtener el historial de solicitudes de cambio
const getExchangeHistory = async (req, res) => {
  const { startDate, endDate } = req.query; // Obtener las fechas de inicio y fin de los parámetros de la consulta

  try {
    // Buscar las solicitudes de cambio en el rango de fechas
    const exchangeRequests = await ExchangeRequest.find({
      fecha: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    res.status(200).json(exchangeRequests); // Respuesta exitosa con las solicitudes encontradas
  } catch (error) {
    console.error('Error al obtener el historial de solicitudes de cambio:', error); // Log de error
    res.status(500).json({ message: 'Error interno del servidor.' }); // Respuesta de error
  }
};

module.exports = { registerExchangeRequest, getExchangeHistory };