const axios = require('axios'); // Librería para hacer peticiones HTTP
const cron = require('node-cron'); // Librería para ejecutar tareas programadas
const { ExchangeRate } = require('./models/exchangeRate'); // Modelo de Mongoose para el tipo de cambio

// Función para obtener el tipo de cambio y guardarlo en la base de datos
const fetchExchangeRate = async () => {
  try {
    const response = await axios.get('https://api.apis.net.pe/v1/tipo-cambio-sunat'); // Petición a la API externa
    const { compra, venta, origen, moneda, fecha } = response.data; // Destructuración de la respuesta

    const newRate = new ExchangeRate({ compra, venta, origen, moneda, fecha }); // Creación del nuevo tipo de cambio
    await newRate.save(); // Guardado en la base de datos
    console.log(`Tipo de cambio guardado: ${fecha} - Compra: ${compra}, Venta: ${venta}`); // Log de éxito
  } catch (error) {
    console.error('Error al obtener el tipo de cambio:', error); // Log de error
  }
};

// Ejecutar la tarea cada 30 segundos
cron.schedule('*/30 * * * * *', fetchExchangeRate);