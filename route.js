const config = require('./config')
const express = require('express')
const middleware = require('./middleware')
const router = express.Router()
const User = require('./models/User')

router.get('/', middleware.checkAuthentication, (req, res) => {
  res.render('index', {
    page: 'HOME',
  })
})

router.get('/settings', middleware.checkAuthentication, (req, res) => {
  res.render('settings', {
    page: 'SETTINGS',
  })
})

router.route('/login')
  .get((req, res, next) => {
    try {
      const error = req.session.error
      res.render('login', {
        page: 'LOGIN',
        error
      })
    } catch(err) {
      // LOG: console.error("Failed to load page: " + err)
      // next("Error occured when loading page")
      res.status(404).send("Error occured when loading page")
    } finally {
      req.session.error = null
    }
  })
  .post(async (req, res, next) => {
    if (req.body.password === config.ROOM_PASSWORD) {
      req.session.isAuthenticate = true
      req.session.username = req.body.username

      try {
        // TODO: perform check for IP before creating to avoid duplication
        // NOTE: can't do IP check on local
        if (await User.findOne({
          username: req.body.username,
          status: 'ACTIVE'
        })) {
          req.session.error = "Username already taken"  
          res.redirect('/login')
        } else {
          const newUser = new User({
            address: req.sessionID,  // default to null
            username: req.body.username,
            role: await User.findOne() ? 'MEMBERS' : 'ADMIN',
            status: 'ACTIVE'
          })

          const registeredUser = await newUser.save()
          req.session.documentID = registeredUser.id
          res.redirect('/')
        }
      } catch(err) {
        // LOG: console.error("Failed to register user: " + err)
        next("Failed to register user")
      }

    } else {
      req.session.error = "Failed to authenticate user"
      res.redirect('/login')
    }
  })

router.get('/logout', async (req, res, next) => {
  try {
    User.deleteOne({_id: req.session.documentID}, (err, deletedUser) => {
      if (err) {
        throw new Error(err)
        // LOG: if (err) console.error("Failed to delete user from database: " + err)
      }
      req.session.destroy((err) => {
        if (err) {
          throw new Error(err)
          // LOG: if (err) console.error("Failed to destroy session: " + err)
        }
        res.redirect('/login')
      })
    })
  } catch(err) {
    // LOG: if (err) console.error("Error occured when logging out: " + err)
    next("Error occured when logging out")
  }
})

router.get('/error', (req, res) => {
  res.render('error', {
    page: 'ERROR',
    error: 'Error!'
  })
})

module.exports = router
