const PORT = 3000;

// Importamos configuración del servidor
const app = require('./app');


// Ponemos a escuchar el servidor
app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
} )