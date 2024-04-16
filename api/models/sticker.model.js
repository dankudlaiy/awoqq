const mongoose = require('mongoose')
const schema = mongoose.Schema

const stickerSchema = new schema({
    emoji: {
        type: String,
        required: true
    },
    photo: {
        type: Buffer,
        required: true
    },
    file_id: {
        type: String,
        required: false
    },
    stickerSet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stickerSet',
        required: true
    }
})

const product = mongoose.model('sticker', stickerSchema)
module.exports = product;