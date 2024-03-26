const emojiRegex = require('emoji-regex');

const bot = require("../../common");
const states = require("../../helpers/states.dict")
const UserStates = require("../../enums/userStates");

const Sticker = require("../../../api/models/sticker.model")
const StickerSet = require("../../../api/models/stickerSet.model");

const ManageStickerCallback = require("../../callbacks/manageSticker.callback");
const AddStickerCallback = require("../../callbacks/addSticker.callback");
const StartCallback = require("../../callbacks/start.callback");
const RemoveStickerSetCallback = require("../../callbacks/removeStickerSet.callback");

module.exports = async function (msg){
    const chatId = msg.from.id;

    const emoji = msg.text;

    if (!isOnlyEmojis(emoji)) {
        await bot.sendMessage(chatId, 'not a valid emoji please try again')
        return;
    }

    const buffer = states[chatId].data['buffer'];
    const stickerSet_id = states[chatId].data['stickerSet_id'];

    const sticker = {
        emoji: emoji,
        photo: buffer,
        stickerSet_id: stickerSet_id
    };

    const insertion = new Sticker(sticker);
    await insertion.save();

    states[chatId] = {
        state: UserStates.DEFAULT,
        data: {}
    };

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

    await bot.sendMessage(chatId, stickerSet.name, opts);
}

function isOnlyEmojis(string) {
    const emojis = string.match(emojiRegex());

    if (!emojis) {
        return false;
    }

    const emojiOnlyString = emojis.join('');

    return string === emojiOnlyString;
}