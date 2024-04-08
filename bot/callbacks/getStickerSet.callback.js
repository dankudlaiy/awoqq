const CallbackBase = require("../helpers/callback.base");

const GetStickerSetEvent = require("../events/queries/getStickerSet.query");

class GeteStickerSetCallback extends CallbackBase {
    constructor(stickerSet_id) {
        super();

        //custom fields
        this.stickerSet_id = stickerSet_id;

        //base fields
        this.prefix = 'get_stickerSet';
        this.event = GetStickerSetEvent;
    }
}

module.exports = GeteStickerSetCallback