const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    type: { type: String },
    sender: { type: String },
    receiver: { type: String },
    size: { type: Number },
})

module.exports = mongoose.model('Data', dataSchema)
