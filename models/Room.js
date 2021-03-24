const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    users: { type: String },
    name: { type: String },
})

module.exports = mongoose.model('Room', roomSchema)

