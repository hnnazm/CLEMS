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
        default: 'members'
    },
    socketID: {
        type: String,
        default: ''
    },
    options: {
        // nested schematype
        mutedUser: {
            type: [String],     // array of username
            default: [],
        }
    }
})

module.exports = mongoose.model('User', userSchema)
