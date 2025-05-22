const express = require('express');
const path = require('path');
const hbs = require('hbs');
const morgan = require('morgan');
const router = require('./routes/pagesRouter');

// Servidor
const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(express.json());

// Utilizar las vistas de handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Rutas
app.use('/', router)

// Exportar la configuración del servidor
module.exports = app;