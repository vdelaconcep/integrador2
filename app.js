const express = require('express');
const path = require('path');
const hbs = require('hbs');
const morgan = require('morgan');
const pagesRouter = require('./routes/pagesRouter');
const productosRouter = require('./routes/productosRouter');
const mensajesRouter = require('./routes/mensajesRouter');
const { title } = require('process');

// Servidor
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilizar las vistas de handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Helper de comparación
hbs.registerHelper('esMayor', function (a, b, options) {
    if (a > b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

// Rutas
app.use('/', pagesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/mensajes', mensajesRouter);

// Página no encontrada (404)
app.use((req, res, next) => {
    res.status(404).render('error', {
        title: '404',
        mensaje: 'Página no encontrada'
    });
});

app.use((err, req, res, next) => {
    res.status(500).render('error', {
        title: '500',
        mensaje: `Error interno del servidor: ${err}`
    })
})

// Exportar la configuración del servidor
module.exports = app;