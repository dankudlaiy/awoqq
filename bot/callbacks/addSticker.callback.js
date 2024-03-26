const CallbackBase = require("../helpers/callback.base");
const AddStickerEvent = require("../events/queries/addSticker.query")

class AddStickerCallback extends CallbackBase {
    constructor(stickerSet_id) {
        super();

        //custom fields
        this.stickerSet_id = stickerSet_id;

        //base fields
        this.prefix = 'add_sticker';
        this.event = AddStickerEvent;
    }
}

module.exports = AddStickerCallback;