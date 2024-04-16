const bot = require("../../common");
const events = require('../../handlers/events.handler')
const states = require("../../helpers/states.dict");
const UserStates = require("../../enums/userStates");

bot.on('callback_query', async (callbackQuery) => {
    try {
        const action = callbackQuery.data.split('.')[0];

        const chatId = callbackQuery.from.id;

        if (states[chatId] === undefined) {
            states[chatId] = {
                state: UserStates.DEFAULT,
                data: {}
            };
        }

        await events[action](callbackQuery);
    } catch (error) {
        console.log(error);
    }
});