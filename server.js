// Importar configuración del servidor
const app = require('./app');

// Importar configuración de dotenv
const dotenv = require('dotenv');
dotenv.config();

// Importar conexión a la base de datos
const connectDB = require('./database/conexionMongo');

// Importar el puerto
const PORT = process.env.PORT || 3000;

// Importar URI de la base de datos
const MONGO_URI = process.env.MONGO_URI;

// Conectar a la base de datos
connectDB(MONGO_URI);

// Ponemos a escuchar el servidor
app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})