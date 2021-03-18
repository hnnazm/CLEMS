const config = require('./config')
const http = require('http')
const express = require('express')
const path = require('path')
const route = require('./route')
const session = require('express-session')
const socketIO = require('socket.io')
const socketHandler = require('./socket')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, config.SOCKET_OPTION)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(session(config.SESSION_OPTION))
app.use(express.static(path.join(__dirname, 'public'), {index: false}))
app.use('/', route)

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

server.listen(config.PORT, config.HOST, () => {
    console.log(`Server is running on port ${config.PORT}`)
})