const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .catch(err => console.log(err.message));

    mongoose.connection.on('connected', () => {
        console.log("mongoose connected to db");
    });

    mongoose.connection.on('error', (err) => {
        console.log(err.message);
    });

    process.on('SIGINT', () => {
        console.log('mongoose connection and server were terminated');

        mongoose.connection.close(() => {
            process.exit(0);
        });
    });
}