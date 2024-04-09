
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bot is running');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Web server is running');
});

require('./events/commands/start.event');
require('./events/base/callbackQuery.event')
require('./events/base/message.event')

console.log('bot is running');