const mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
    name: {
        type: String,
        required: true
    },
     price: {
        type: Number,
         required: true
     }
})

const product = mongoose.model('product', productSchema)
module.exports = product;