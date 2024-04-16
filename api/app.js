const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');

const stickerRoutes = require('./routes/sticker.route');
const userRoutes = require('./routes/user.route');
const userStickerRoutes = require('./routes/userSticker.route');

require('dotenv').config();

require('./initDb')();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(morgan('dev'));

app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/userProducts', userProductRoutes);

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