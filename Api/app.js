const express = require('express'); // Framework para construir el servidor
const mongoose = require('mongoose'); // Librería para manejar MongoDB
const exchangeRoutes = require('./routes'); // Importar rutas

const app = express();
const PORT = process.env.PORT || 3000; // Definir el puerto del servidor

app.use(express.json()); // Middleware para parsear JSON
app.use('/api', exchangeRoutes); // Usar las rutas definidas

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/exchange', {
   // useNewUrlParser: true,
   // useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Conectado a MongoDB'); // Log de éxito
    // Importar el job después de la conexión a MongoDB
    require('./exchangeRateJob');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`); // Log de éxito
    });
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err)); // Log de error
