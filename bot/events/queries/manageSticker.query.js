const bot = require("../../common");

const Sticker = require("../../../api/models/sticker.model");

const RemoveStickerCallback = require("../../callbacks/removeSticker.callback");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    const stickerId = callbackQuery.data.split('.')[1];

    const sticker = await Sticker.findById(stickerId);

    const removeStickerCallback = new RemoveStickerCallback(sticker['_id']);

    const keyboard = {
        inline_keyboard: [
                [
                    { text: 'back', callback_data: `manage_stickerSet.${sticker.stickerSet_id}` },
                    { text: 'delete', callback_data: removeStickerCallback.pack() }
                ]
            ]
    }

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, callbackQuery.message.message_id);

    await bot.sendPhoto(chatId, sticker.photo,
        { caption: `${sticker.emoji}`, reply_markup: keyboard });
}