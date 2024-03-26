const bot = require("../../common")
const states = require("../../helpers/states.dict");
const UserStates = require("../../enums/userStates");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    const stickerSet_id = callbackQuery.data.split('.')[1];

    states[chatId] = {
        state: UserStates.STICKER_PHOTO_INPUT,
        data: {
            stickerSet_id: stickerSet_id
        }
    }

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, callbackQuery.message.message_id);

    await bot.sendMessage(chatId, 'send a sticker photo');
}