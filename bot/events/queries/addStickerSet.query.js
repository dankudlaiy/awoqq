const bot = require("../../common")
const states = require("../../helpers/states.dict");
const UserStates = require("../../enums/userStates");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    states[chatId].state = UserStates.STICKERSET_NAME_INPUT;

    await bot.sendMessage(chatId, 'give a sticker set name');
}