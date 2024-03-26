const UserStates = require("../enums/userStates");

module.exports = {
    [UserStates.STICKERSET_NAME_INPUT]: require('../events/messages/stickerSetName.message'),
    [UserStates.STICKER_EMOJI_INPUT]: require('../events/messages/stickerEmoji.message'),
    [UserStates.STICKER_PHOTO_INPUT]: require('../events/photos/stickerPhoto.photo')
};