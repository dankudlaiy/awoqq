const bot = require("../../common");

const RemoveStickerCallback = require("../../callbacks/removeSticker.callback");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    const stickerId = callbackQuery.data.split('.')[1];

    const sticker = await Product.findById(stickerId);

    const removeStickerCallback = new RemoveStickerCallback(sticker['_id']);

    const keyboard = {
        inline_keyboard: [
                [
                    { text: 'back', callback_data: 'show_all_stickers'},
                    { text: 'delete', callback_data: removeStickerCallback.pack() }
                ]
            ]
    }

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, callbackQuery.message.message_id);

    await bot.sendPhoto(chatId, sticker.photo,
        { caption: `${sticker.name}`, reply_markup: keyboard });
}