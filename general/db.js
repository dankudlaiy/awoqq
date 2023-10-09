const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://dankudlaiy:tfRa5Qm7A5f9qrUR@octo-db.6njtvq9.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
