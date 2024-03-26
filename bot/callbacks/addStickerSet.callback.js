const CallbackBase = require("../helpers/callback.base");
const AddStickerSetEvent = require("../events/queries/addStickerSet.query")

class AddStickerSetCallback extends CallbackBase {
    constructor() {
        super();

        //custom fields

        //base fields
        this.prefix = 'add_stickerSet';
        this.event = AddStickerSetEvent;
    }
}

module.exports = AddStickerSetCallback;