const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  type: {
    type: String
  },
  content: {
    type: String
  },
  sender: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
  recipient: {
    type: [mongoose.ObjectId],
    ref: 'User'
  },
  size: {
    type: Number
  },
}, { timestamps: { createdAt: true, updatedAt: false } })

module.exports = mongoose.model('Data', dataSchema)
