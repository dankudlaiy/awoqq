class CallbackBase {
    constructor() {
        this.prefix = 'prefix';

        this.event = function () {};
    }

    pack() {
        let packedStr = this.prefix;

        const properties = Object.getOwnPropertyNames(this)
            .filter(prop => prop !== "prefix" && prop !== "event");

        properties.forEach((prop) => {
            packedStr += '.' + this[prop];
        });

        return packedStr;
    }

    unpack(str) {
        const fields = str.split('.');

        this.prefix = fields[0];

        const properties = Object.getOwnPropertyNames(this)
            .filter(prop => prop !== "prefix" && prop !== "event");

        properties.forEach((prop, index) => {
            this[prop] = fields[index + 1];
        });
    }
}

module.exports = CallbackBase;