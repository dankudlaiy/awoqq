const bot = require("../../common");

const StickerSet = require("../../../api/models/stickerSet.model");
const Sticker = require("../../../api/models/sticker.model");

const RemoveStickerSetCallback = require("../../callbacks/removeStickerSet.callback");
const StartCallback = require("../../callbacks/start.callback");
const AddStickerCallback = require("../../callbacks/addSticker.callback");
const ManageStickerCallback = require("../../callbacks/manageSticker.callback");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;

    const stickerSet_id = callbackQuery.data.split('.')[1];

    const stickerSet = await StickerSet.findById(stickerSet_id);

    const stickers = await Sticker.find({ stickerSet_id: stickerSet_id },{__v: 0}, undefined)

    const keyboard = [];

    stickers.forEach(function (sticker) {
        const manageStickerCallback = new ManageStickerCallback(sticker.id);

        keyboard.push([{ text: sticker.emoji, callback_data: manageStickerCallback.pack() }]);
    });

    const addStickerCallback = new AddStickerCallback(stickerSet_id);

    keyboard.push([{ text: "New", callback_data: addStickerCallback.pack() }]);

    const backCallback = new StartCallback();

    const removeStickerSetCallback = new RemoveStickerSetCallback(stickerSet_id);

    keyboard.push(
        [
            {
                text: 'Back', callback_data: backCallback.pack()},
            {
                text: 'Remove', callback_data: removeStickerSetCallback.pack()
            }
        ]
    );

    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    };

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, callbackQuery.message.message_id);

    await bot.sendMessage(chatId, stickerSet.name, opts);
}