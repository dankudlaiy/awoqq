const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    chat_id: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

const user = mongoose.model('user', userSchema)
module.exports = user;