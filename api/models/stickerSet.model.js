const mongoose = require('mongoose')
const schema = mongoose.Schema

const stickerSetSchema = new schema({
    name: {
      type: String,
      required: true
    },
    empty: {
        type: Boolean,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

const userProduct = mongoose.model('stickerSet', stickerSetSchema)
module.exports = userProduct;