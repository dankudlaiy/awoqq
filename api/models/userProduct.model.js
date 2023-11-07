const mongoose = require('mongoose')
const schema = mongoose.Schema

const userProductSchema = new schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
})

const userProduct = mongoose.model('userProduct', userProductSchema)
module.exports = userProduct;