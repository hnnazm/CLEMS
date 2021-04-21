const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  type: {
    type: String
  },
  data: {
    type: String
  },
  sender: {
    type: String
  },
  recipient: {
    type: [String]
  },
  size: {
    type: Number
  },
})

module.exports = mongoose.model('Data', dataSchema)
