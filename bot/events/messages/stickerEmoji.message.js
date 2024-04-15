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
const GetStickerSetCallback = require("../../callbacks/getStickerSet.callback");

module.exports = async function (msg){
    const chatId = msg.from.id;

    const emoji = msg.text;

    if (!isOnlyEmojis(emoji)) {
        await bot.sendMessage(chatId, 'not a valid emoji please try again')
        return;
    }

    const buffer = states[chatId].data['buffer'];
    const stickerSet_id = states[chatId].data['stickerSet_id'];

    const stickerSet = await StickerSet.findById(stickerSet_id);

    const sticker = {
        emoji: emoji,
        photo: buffer,
        stickerSet_id: stickerSet_id
    };

    const insertion = new Sticker(sticker);
    const saved_sticker = await insertion.save();

    await bot.addStickerToSet(msg.from.id, `${stickerSet.name.replace(/ /g, '_')}_by_plshs_bot`, buffer, emoji);

    states[chatId] = {
        state: UserStates.DEFAULT,
        data: {}
    };

    const stickers = await Sticker.find({ stickerSet_id: stickerSet_id },{__v: 0}, undefined)

    const keyboard = [];

    const tgStickerSet = await bot.getStickerSet(`${stickerSet.name.replace(/ /g, '_')}_by_plshs_bot`);

    const newSticker = tgStickerSet.stickers[tgStickerSet.stickers.length - 1];

    saved_sticker.file_id = newSticker.file_id;
    saved_sticker.save();

    if (stickerSet.empty) {
        await bot.deleteStickerFromSet(tgStickerSet.stickers[0].file_id);

        stickerSet.empty = false;
        stickerSet.save();
    }

    stickers.forEach(function (sticker) {
        const manageStickerCallback = new ManageStickerCallback(sticker.id);

        keyboard.push([{ text: sticker.emoji, callback_data: manageStickerCallback.pack() }]);
    });

    const addStickerCallback = new AddStickerCallback(stickerSet_id);

    keyboard.push([{ text: "New", callback_data: addStickerCallback.pack() }]);

    const backCallback = new StartCallback();

    const getStickerSetCallback = new GetStickerSetCallback(stickerSet_id);

    const removeStickerSetCallback = new RemoveStickerSetCallback(stickerSet_id);

    keyboard.push(
        [
            {
                text: 'Back', callback_data: backCallback.pack()
            },
            {
                text: 'Get', callback_data: getStickerSetCallback.pack()
            },
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