const express = require('express');
const app = express();

const usersRoutes = require('./api/routes/users');
app.use('/users', usersRoutes);

module.exports = app;