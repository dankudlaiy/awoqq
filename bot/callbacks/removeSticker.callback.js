const CallbackBase = require("../helpers/callback.base");
const RemoveStickerEvent = require("../events/queries/removeSticker.query");

class RemoveStickerCallback extends CallbackBase {
    constructor(sticker_id, file_id) {
        super();

        //custom fields
        this.sticker_id = sticker_id;
        this.file_id = file_id;

        //base fields
        this.prefix = 'remove_sticker';
        this.event = RemoveStickerEvent;
    }
}

module.exports = RemoveStickerCallback