const bot = require("../../common");

const Sticker = require("../../../api/models/sticker.model");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;

    const id = callbackQuery.data.split('.')[1];

    const sticker = await Sticker.findById(id);

    const stickerSetId = sticker.stickerSet_id;
    const file_id = sticker.file_id;

    await Sticker.findByIdAndDelete(id);

    await bot.deleteStickerFromSet(file_id);

    const keyboard = {
        inline_keyboard: [
            [
                { text: 'back', callback_data: `manage_stickerSet.${stickerSetId}`}
            ]
        ]
    }

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, messageId);

    await bot.sendMessage(chatId, 'sticker deleted !', { reply_markup: keyboard });
}