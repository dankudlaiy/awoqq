const CallbackBase = require("../helpers/callback.base");
const StartEvent = require("../events/queries/start.query");

class StartCallback extends CallbackBase {
    constructor() {
        super();

        //custom fields

        //base fields
        this.prefix = 'start';
        this.event = StartEvent;
    }
}

module.exports = StartCallback