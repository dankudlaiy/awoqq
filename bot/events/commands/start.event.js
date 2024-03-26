const bot = require("../../common");

const User = require("../../../api/models/user.model");
const StickerSet = require("../../../api/models/stickerSet.model");

const ManageStickerSetCallback = require("../../callbacks/manageStickerSet.callback");
const AddStickerSetCallback = require("../../callbacks/addStickerSet.callback");

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.from.id;

    // add user if not exists
    if (!await User.findOne({chat_id: chatId}).exec()) {
        const insertion = new User(
            {
                chat_id: chatId,
                username: msg.from.username
            });

        await insertion.save();
    }

    const user = await User.findOne({chat_id: chatId}).exec();

    const stickerSets = await StickerSet.find({ user_id: user.id }, {__v: 0},  undefined);

    const keyboard = [];

    stickerSets.forEach(function (stickerSet) {
        const manageStickerSetCallback = new ManageStickerSetCallback(stickerSet.id);

        keyboard.push([{ text: stickerSet.name, callback_data: manageStickerSetCallback.pack() }]);
    });

    const addStickerSetCallback = new AddStickerSetCallback();

    keyboard.push([{ text: "New", callback_data: addStickerSetCallback.pack() }]);

    const opts = {
        reply_markup: JSON.stringify({
            inline_keyboard: keyboard
        })
    };

    await bot.sendMessage(chatId, 'Sticker Sets', opts);
});
