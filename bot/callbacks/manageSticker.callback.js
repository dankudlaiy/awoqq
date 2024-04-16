const CallbackBase = require("../helpers/callback.base");

const ManageStickerEvent = require("../events/queries/manageSticker.query");

class ManageStickerCallback extends CallbackBase {
    constructor(sticker_id) {
        super();

        //custom fields
        this.sticker_id = sticker_id;

        //base fields
        this.prefix = 'manage_sticker';
        this.event = ManageStickerEvent;
    }
}

module.exports = ManageStickerCallback