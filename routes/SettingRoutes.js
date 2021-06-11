const middleware = require('../middleware')
const mongoose = require('mongoose')
const router = require('express').Router()
const User = require('../models/User')

router.post('/username', async (req, res) => {
  const existingUser = await User.findOne({
    username: req.body.username,
    status: 'ACTIVE' })

  if (!existingUser && req.body.username) {
    User.findOne({
      address: req.sessionID,
      status: 'ACTIVE'
    }, (err, doc) => {
        if (err) console.log(err)
        doc.options.prevUsername.push(doc.username)
        doc.username = req.body.username
        doc.save()
      })
    res.send({ err: null, username: req.body.username })
  }
  else res.send({ err: "Failed to change username", username: null })
})

router.post('/roomname', (req, res) => {
  if (req.session.isAdmin) {
    if (req.body.roomname) {
      req.app.locals.roomname = req.body.roomname
      res.send({ err: null, roomname: req.body.roomname })
    }
    else res.send({ err: "Failed to change room name", roomname: null })
  } else res.status(403).end()
})

router.get('/terminate', middleware.checkAuthentication, (req, res) => {
  if (req.session.isAdmin) {
    mongoose.connection.db.dropDatabase();
    process.kill(process.pid, 'SIGTERM')
    require('child_process').exec('shutdown')
    res.send("Deleting room.. Device will shutdown.")
  }
  else res.status(403).end()
})

module.exports = router
