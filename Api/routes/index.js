const express = require('express'); // Framework para construir el servidor
const router = express.Router();
const { registerExchangeRequest, getExchangeHistory } = require('../controllers/exchangeController'); // Importar controladores

// Definir la ruta para registrar solicitudes de cambio
router.post('/exchange', registerExchangeRequest);

// Definir la ruta para obtener el historial de solicitudes de cambio
router.get('/exchange/history', getExchangeHistory);

module.exports = router;