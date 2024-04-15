const bot = require("../../common");
const StickerSet = require("../../../api/models/stickerSet.model");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    const stickerSet_id = callbackQuery.data.split('.')[1];

    const stickerSet = await StickerSet.findById(stickerSet_id);

    if (stickerSet.empty) {
        await bot.answerCallbackQuery(callbackQuery.id, { text: "The sticker set is empty !", show_alert: true });
        return;
    }

    const tgStickerSet = await bot.getStickerSet(`${stickerSet.name.replace(/ /g, '_')}_by_plshs_bot`);

    const stickers = tgStickerSet.stickers;
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];

    const keyboard = {
        inline_keyboard: [
            [
                { text: 'back', callback_data: `manage_stickerSet.${stickerSet_id}` }
            ]
        ]
    }

    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard.inline_keyboard
        })
    };

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, callbackQuery.message.message_id);

    await bot.sendSticker(chatId, randomSticker.file_id, opts);

    //await bot.sendMessage(chatId, stickerSet.name, opts);
}