const bot = require("../../common");
const events = require("../../handlers/messages.handler");
const states = require("../../helpers/states.dict");
const UserStates = require("../../enums/userStates");

bot.on('message', async (msg) => {
    try {
        const chatId = msg.from.id;

        if (states[chatId] === undefined) {
            states[chatId] = {
                state: UserStates.DEFAULT,
                data: {}
            };
        } else {
            const state = states[chatId].state;

            await events[state](msg);
        }
    } catch (error) {
        console.error(error);
    }
});