const config = require('./config')
const http = require('http')
const express = require('express')
const path = require('path')
const session = require('express-session')
const socketIO = require('socket.io')

// Routing
const ExportRoutes = require('./routes/ExportRoutes')
const FileRoutes = require('./routes/FileRoutes')
const MainRoute = require('./routes/MainRoutes')
const SettingRoutes = require('./routes/SettingRoutes')

// Database model
const Data = require('./models/Data')
const User = require('./models/User')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, config.SOCKET_OPTIONS)
const sessionMiddleware = session(config.SESSION_OPTIONS)

app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('trust proxy', true)
app.set('serverSocket', io)     // access with req.app.get()
// possible to make as middleware?

app.use(express.urlencoded(config.EXPRESS_URLENCODED_OPTIONS))
app.use(sessionMiddleware)
app.use(express.static(path.resolve(__dirname, 'public'), {index: false}))
app.use(route)

app.locals.title = 'CLEMS'

io.use((socket, next) => {sessionMiddleware(socket.request, {}, next)})

io.on("connection", async socket => {
  // session management
  const session = socket.request.session
  session.connections++;
  session.save();

  const ip = socket.conn.remoteAddress.split(":").pop()

  //LOG: console.log("New client connected")
  await User.findOneAndUpdate({ address: socket.request.sessionID }, {
    // insert socket id to user document
    socketID: socket.id
  }, { new: true })

  // Incoming new message
  socket.on('newMessage', async message => {
    // TODO: bind with document id for best practice
    let clientSockets = [...await io.allSockets()].filter(socketID => socketID != socket.id)
    let recipientList = new Array()
    clientSockets.forEach(socketID => {
      User.findOne({ socketID }, (err, user) => {
        //LOG: if (err) console.error("Error fetching other users: " + err)
        if (user) recipientList.push(user.id)
      })
    })
    User.findOne({socketID: socket.id}, (err, user) => {
      //LOG: if (err) console.error("Error finding users: " + err)
      Data.create({
        type: typeof message,
        data: message,
        sender: user.id,
        recipient: recipientList,     // TODO: change to user/room
        size: 12345             // TODO: insert correct size
      }, (err, data) => {
          //LOG: if (err) console.error("Error creating data: " + err)
          //LOG: console.log(data)
          io.emit('receiveMessage', message, {
            id: user.socketID,
            username: user.username
          })
        })
    })
  })

  // Client disconnect
  socket.on('disconnect', () => {
    //LOG: console.log("Client disconnect")
  })
});

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`) //LOG
})
