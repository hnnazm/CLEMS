const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'MEMBERS'],
    default: 'MEMBERS'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
  },
  socketID: {
    type: String,
    default: ''
  },
  options: {
    // nested schematype
    prevUsername: {
      type: [String],     // array of previous username
      default: [],
    }
  }
})

module.exports = mongoose.model('User', userSchema)
