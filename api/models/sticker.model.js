const mongoose = require('mongoose')
const schema = mongoose.Schema

const stickerSchema = new schema({
    emoji: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: Buffer,
        required: true
    },
    stickerSet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stickerSet',
        required: true
    }
})

const product = mongoose.model('sticker', stickerSchema)
module.exports = product;