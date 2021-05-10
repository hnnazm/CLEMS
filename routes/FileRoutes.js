const router = require('express').Router()
const db = require('../db')

router.get('/image/:filename', (req, res) => {
  db.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      })
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = db.gfs.createReadStream(file.filename)
      readstream.pipe(res)
    } else {
      res.status(404).json({
        err: 'Not an image'
      })
    }
  })
})

router.put('/send', (req, res) => {
  db.media(req, res, (err) => {
    if (err) res.send({ data: null, err: "An error occured" })
    else {
      res.send({ data: req.file, err: null })
    }
  })
})

router.get('/show', (req, res) => {
  db.gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('error', { files: false })
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
        ) {
          file.isImage = true
        } else {
          file.isImage = false
        }
      })
      res.render('error', { files: files })
    }
  })
})

module.exports = router
