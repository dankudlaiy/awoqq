const mongoose = require('mongoose')
const schema = mongoose.Schema

const userProductSchema = new schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
})

const userProduct = mongoose.model('userProduct', userProductSchema)
module.exports = userProduct;