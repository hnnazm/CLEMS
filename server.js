const config = require('./config')
const express = require('express')
const middleware = require('./middleware')
const path = require('path')
const session = require('express-session')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(session(config.SESSION_OPTION));
app.use(express.static(path.join(__dirname, 'dist'), {index: false}))

app.get('/', middleware.checkAuthentication, (req, res) => {
    // res.send("<h1>Home Page</h1>")
    res.send({isAuthenticate: true})
    res.send({isAuthenticate: 'asd'})
})

app.route('/login')
    .get(function (req, res) {
        // res.sendFile(path.join(__dirname, 'public','login.html'))
        res.sendFile(path.join(__dirname, 'dist', 'index.html'))
        // res.send("<h1>Login Page</h1>")
    })
    .post(function (req, res) {
        if (req.body.username === 'admin' && req.body.pwd === 'secret') {
            req.session.isAuthenticate = true;
            res.redirect('/')
        } else {
            res.redirect('/login')
        }
    })


app.listen(config.PORT, config.HOST, () => {
    console.log(`Server is running on port ${config.PORT}`)
})