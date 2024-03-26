const bot = require("../../common");
const states = require("../../helpers/states.dict");
const PhotoHelper = require("../../helpers/photo.helper")

const UserStates = require("../../enums/userStates");

module.exports = async function (msg){
    const chatId = msg.from.id;

    let photo = msg.photo[0];

    msg.photo.forEach((p) => {
        if (p.file_size < 200000) {
            photo = p;
        }
    });

    const photoFileId = photo.file_id;

    const fileLink = await bot.getFileLink(photoFileId);

    const arrayBuffer = await (await fetch(fileLink)).arrayBuffer();

    const originalBuffer = Buffer.from(arrayBuffer);

    const buffer = await PhotoHelper.resizeImage(originalBuffer);

    const stickerSet_id = states[chatId].data['stickerSet_id'];

    states[chatId] = {
        state: UserStates.STICKER_EMOJI_INPUT,
        data: {
            buffer: buffer,
            stickerSet_id: stickerSet_id
        }
    }

    await bot.sendMessage(chatId, 'give a sticker emoji');
}