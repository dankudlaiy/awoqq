const bot = require("../../common");
const states = require("../../helpers/states.dict")
const UserStates = require("../../enums/userStates");

const StickerSet = require("../../../api/models/stickerSet.model");
const User = require("../../../api/models/user.model");

const ManageStickerSetCallback = require("../../callbacks/manageStickerSet.callback");
const AddStickerSetCallback = require("../../callbacks/addStickerSet.callback");

module.exports = async function (msg){
    const chatId = msg.from.id;

    const name = msg.text;

    states[chatId].state = UserStates.DEFAULT;

    const user = await User.findOne({chat_id: chatId}).exec();

    const stickerSet = new StickerSet(
        {
            name: name,
            user_id: user.id
        });

    await stickerSet.save();

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
}