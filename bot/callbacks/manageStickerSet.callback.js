const CallbackBase = require("../helpers/callback.base");

const ManageStickerSetEvent = require("../events/queries/manageStickerSet.query");

class ManageStickerSetCallback extends CallbackBase {
    constructor(stickerSet_id) {
        super();

        //custom fields
        this.stickerSet_id = stickerSet_id;

        //base fields
        this.prefix = 'manage_stickerSet';
        this.event = ManageStickerSetEvent;
    }
}

module.exports = ManageStickerSetCallback