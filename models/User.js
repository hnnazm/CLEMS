const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    address: { type: String },
    username: { type: String },
    role: { type: String },
})

module.exports = mongoose.model('User', userSchema)
