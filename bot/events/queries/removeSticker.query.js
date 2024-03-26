const bot = require("../../common");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;

    const id = callbackQuery.data.split('.')[1];

    await Product.findByIdAndDelete(id);

    const keyboard = {
        inline_keyboard: [
            [
                { text: 'back', callback_data: 'show_all_stickers'}
            ]
        ]
    }

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, messageId);

    await bot.sendMessage(chatId, 'sticker deleted !', { reply_markup: keyboard });
}