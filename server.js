const PORT = 3000;
const mongoose = require('mongoose');

// Importamos configuración del servidor
const app = require('./app');

// Conectar a la base de datos
const uri = "mongodb+srv://vdelaconcep:practico9@cluster0.lw36mte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.log('No se pudo conectar con la base de datos', err));


// Ponemos a escuchar el servidor
app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
} )