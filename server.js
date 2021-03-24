const config = require('./config')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const route = require('./route')
const session = require('express-session')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, config.SOCKET_OPTIONS)
const db = mongoose.connection

app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded(config.EXPRESS_URLENCODED_OPTIONS))
app.use(session(config.SESSION_OPTIONS))
app.use(express.static(path.resolve(__dirname, 'public'), {index: false}))
app.use('/', route)

mongoose.connect(config.MONGOOSE_URI, config.MONGOOSE_OPTIONS)
db.on('error', () => console.error('Error connecting to database:'))
db.once('open', () => console.log('Database connected!'))

io.on("connection", socket => {
    console.log("New client connected")

    // Incoming new message
    socket.on('newMessage', (message) => {
        console.log(`Message sent: ${message}` )
        io.emit('receiveMessage', message, socket.id)
    })

    // Client disconnect
    socket.on('disconnect', () => {
        console.log("Client disconnect")
    })
});

server.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})
