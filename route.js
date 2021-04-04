const config = require('./config')
const Data = require('./models/Data')
const express = require('express')
const middleware = require('./middleware')
const router = express.Router()
const User = require('./models/User')

router.get('/', middleware.checkAuthentication, (req, res) => {
    var io = req.app.get('serverSocket')

    io.on("connection", async socket => {
        console.log("New client connected")
        await User.findOneAndUpdate({ address: req.sessionID }, {
            // insert socket id to user document
            socketID: socket.id
        }, { new: true })

        // Incoming new message
        socket.on('newMessage', async message => {
            const user = await User.findOne({socketID: socket.id})
            Data.create({
                type: typeof message,
                data: message,
                sender: user.id,
                receiver: 'to you',     // TODO: change to user/room
                size: 12345             // TODO: insert correct size
            }, (err, data) => {
                if (err) console.error(err)

                io.emit('receiveMessage', message, {
                    id: user.socketID,
                    username: user.username
                })
            })
        })

        // Client disconnect
        socket.on('disconnect', () => {
            console.log("Client disconnect")
        })
    });

    res.render('index', {
        title: 'HOME',
    })
})

router.route('/login')
    .get((req, res) => {
        const error = req.session.error
        req.session.error = null
        res.render('login', {
            title: 'LOGIN',
            error
        })
    })
    .post(async (req, res) => {
        if (req.body.password === config.ROOM_PASSWORD) {
            req.session.isAuthenticate = true
            req.session.username = req.body.username

            // TODO: perform check for IP before creating to avoid duplication
            await User.create({
                address: req.sessionID,  // default to null
                username: req.body.username,
                role: await User.findOne() ? 'members' : 'admin'
            })

            res.redirect('/')
        } else {
            req.session.error = "Failed to authenticate user"
            res.redirect('/login')
        }
    })

router.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        if (err) console.log("Error occured when logging out: " + err)
        res.redirect('/login')
    })
})

module.exports = router
