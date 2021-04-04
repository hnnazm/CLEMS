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

function User(address, username) {
    this.address = address              // default to null or ''
    this.username = username
    this.role = 'members'               // default to members

    return this
}

module.exports = mongoose.model('User', userSchema)
// module.exports = User
