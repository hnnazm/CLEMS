const express = require('express')
const middleware = require('./middleware')
const router = express.Router()

router.get('/', middleware.checkAuthentication, (req, res) => {
    res.render('index', {
        title: 'HOME'
    })
})

router.route('/login')
    .get(function (req, res) {
        // res.sendFile(path.join(__dirname, 'public','login.html'))
        // res.sendFile(path.join(__dirname, 'dist', 'index.html'))
        // res.send("<h1>Login Page</h1>")
        const error = req.session.error
        req.session.error = null
        res.render('login', {
            title: 'LOGIN',
            error
        })
    })
    .post(function (req, res) {
        if (req.body.username === 'admin' && req.body.password === 'secret') {
            req.session.isAuthenticate = true;
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