const fs = require('fs');
const path = require('path');
const callbacksDir = path.join(__dirname, '../callbacks');

let events = {};

fs.readdirSync(callbacksDir).forEach(file => {
    const CallbackClass = require(path.join(callbacksDir, file));
    const callbackInstance = new CallbackClass();

    events[callbackInstance.prefix] = callbackInstance.event;
});

module.exports = events;