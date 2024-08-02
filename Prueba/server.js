const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('cron');
const ExchangeRate = require('./models/ExchangeRate');
const ExchangeRequest = require('./models/ExchangeRequest');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/currency_exchange', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
});

// Middleware para manejar JSON
app.use(express.json());

// Ruta para manejar solicitudes de cambio de moneda
app.post('/convert', async (req, res) => {
  const { monedaOrigen, monedaDestino, monto } = req.body;

  // Verificar que el origen y destino son "USD" y "PEN"
  if (monedaOrigen !== 'USD' || monedaDestino !== 'PEN') {
    return res.status(400).send('Solo se permiten cambios entre USD y PEN.');
  }

  try {
    // Obtener el tipo de cambio más reciente
    const latestRate = await ExchangeRate.findOne()
      .sort({ fecha: -1 })
      .exec();

    if (!latestRate) {
      return res.status(500).send('No se pudo encontrar el tipo de cambio.');
    }

    // Calcular el monto cambiado
    const montoCambiado = monto * latestRate.venta;

    // Crear un nuevo registro de solicitud de cambio
    const exchangeRequest = new ExchangeRequest({
      monedaOrigen,
      monedaDestino,
      monto,
      montoCambiado,
      tipoCambio: latestRate.venta,
    });

    await exchangeRequest.save();

    res.json(exchangeRequest);
  } catch (error) {
    console.error('Error al procesar la solicitud de cambio:', error);
    res.status(500).send('Error en el procesamiento de la solicitud de cambio.');
  }
});

// Función para obtener y guardar el tipo de cambio
async function fetchAndSaveExchangeRate() {
  try {
    const response = await axios.get('https://api.apis.net.pe/v1/tipo-cambio-sunat');
    const data = response.data;

    const exchangeRate = new ExchangeRate({
      compra: data.compra,
      venta: data.venta,
      origen: data.origen,
      moneda: data.moneda,
      fecha: new Date(data.fecha),
    });

    await exchangeRate.save();
    console.log('Tipo de cambio guardado:', exchangeRate);
  } catch (error) {
    console.error('Error al obtener el tipo de cambio:', error);
  }
}

// Configurar tarea cron para ejecutar cada 30 segundos
const job = new cron.CronJob('*/30 * * * * *', fetchAndSaveExchangeRate);
job.start();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});