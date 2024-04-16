const CallbackBase = require("../helpers/callback.base");
const RemoveStickerSetEvent = require("../events/queries/removeStickerSet.query");

class RemoveStickerSetCallback extends CallbackBase {
    constructor(stickerSet_id) {
        super();

        //custom fields
        this.stickerSet_id = stickerSet_id;

        //base fields
        this.prefix = 'remove_stickerSet';
        this.event = RemoveStickerSetEvent;
    }
}

module.exports = RemoveStickerSetCallback