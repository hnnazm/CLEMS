const config = require('./config')
const express = require('express')
const middleware = require('./middleware')
const router = express.Router()
const User = require('./models/User')

router.get('/', middleware.checkAuthentication, (req, res) => {
  res.render('index', {
    title: 'HOME',
  })
})

router.get('/settings', middleware.checkAuthentication, (req, res) => {
  res.render('settings', {
    title: 'SETTINGS',
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
      // NOTE: can't do IP check on local
      if (await User.findOne({username: req.body.username})) {
        req.session.error = "Username already taken"  
        res.redirect('/login')
      } else {
        User.create({
          address: req.sessionID,  // default to null
          username: req.body.username,
          role: await User.findOne() ? 'members' : 'admin'
        }, (err, user) => {
            //LOG: console.error(err)
            //LOG: console.log(`User is created: ${user}`)
          })

        res.redirect('/')
      }

    } else {
      req.session.error = "Failed to authenticate user"
      res.redirect('/login')
    }
  })

router.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    //LOG: if (err) console.error("Error occured when logging out: " + err)
    res.redirect('/login')
  })
})

module.exports = router
