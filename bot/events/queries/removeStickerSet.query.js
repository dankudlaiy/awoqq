const bot = require("../../common");

const StickerSet = require("../../../api/models/stickerSet.model");
const User = require("../../../api/models/user.model");

const AddStickerSetCallback = require("../../callbacks/addStickerSet.callback");

module.exports = async function (callbackQuery){
    const chatId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;

    const id = callbackQuery.data.split('.')[1];

    const stickerSet = await StickerSet.findById(id);

    await bot.deleteStickerSet(`${stickerSet.name.replace(/ /g, '_')}_by_plshs_bot`);

    await StickerSet.findByIdAndDelete(id);

    await bot.answerCallbackQuery(callbackQuery.id);

    await bot.deleteMessage(chatId, messageId);

    const user = await User.findOne({chat_id: chatId}).exec();

    const stickerSets = await StickerSet.find({ user_id: user.id }, {__v: 0},  undefined);

    const keyboard = [];

    stickerSets.forEach(function (stickerSet) {
        keyboard.push([{ text: stickerSet.name, callback_data: `manage_stickerSet.${stickerSet.id}` }]);
    });

    const addStickerSetCallback = new AddStickerSetCallback();

    keyboard.push([{ text: "New", callback_data: addStickerSetCallback.pack() }]);

    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    };

    await bot.sendMessage(chatId, 'Sticker Sets', opts);
}