const express = require('express');
const morgan = require('morgan');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/product.route');
const createError = require('http-errors');

require('dotenv').config();

require('./initDb')();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use('/users', usersRoutes);
app.use('/products', productsRoutes);

app.use((req, res, next) => {
    next(createError(404, "Not found"));
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status,
            message: error.message
        }
    });
});

module.exports = app;