const fs = require('fs')
const path = require('path')
const json2csv = require('json2csv')
const router = require('express').Router()
const Data = require('../models/Data')
const User = require('../models/User')

router.get('/chat', async (req, res) => {
  if (req.session.isAdmin) {
    const fields = [
      'createdAt',
      'sender.id',
      'sender.username',
      'content',
      'type',
    ]

    Data.find().populate('sender').exec((err, docs) => {
      if (err) res.status(500)
      else {
        let csv
        try {
          csv = json2csv.parse(docs, { fields, quote: '' })
        } catch (err) {
          return res.status(500).json({ err })
        }
        const dateTime = Date.now()
        const filePath = path.join(__dirname, "..", "public", "exports", "chat-csv-" + dateTime + ".csv")
        fs.writeFile(filePath, csv, function (err) {
          if (err) {
            return res.json(err).status(500)
          }
          else {
            setTimeout(function () {
              fs.unlinkSync(filePath) // delete this file after 30 seconds
            }, 30000)
            return res.redirect("/exports/chat-csv-" + dateTime + ".csv")
          }
        })

      }
    })
  } else res.status(403).end()
})

router.get('/user', async (req, res) => {
  if (req.session.isAdmin) {
    const fields = [
      'address',
      'username',
      'role',
      'status',
      'socketID',
      'options.prevUsername'
    ]

    User.find((err, docs) => {
      if (err) res.status(500)
      else {
        let csv
        try {
          csv = json2csv.parse(docs, { fields, quote: '' })
        } catch (err) {
          return res.status(500).json({ err })
        }
        const dateTime = Date.now()
        const filePath = path.join(__dirname, "..", "public", "exports", "user-csv-" + dateTime + ".csv")
        fs.writeFile(filePath, csv, function (err) {
          if (err) {
            return res.json(err).status(500)
          }
          else {
            setTimeout(function () {
              fs.unlinkSync(filePath) // delete this file after 30 seconds
            }, 30000)
            return res.redirect("/exports/user-csv-" + dateTime + ".csv")
          }
        })

      }
    })
  } else res.status(403).end()
})

module.exports = router
