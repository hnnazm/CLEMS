const config = require('./config')
const crypto = require('crypto')
const Grid = require('gridfs-stream')
const GridFsStorage = require('multer-gridfs-storage')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')


const connection = mongoose.connect(config.MONGOOSE_URI, config.MONGOOSE_OPTIONS)

//LOG: db.on('error', () => console.error('Error connecting to database:'))
mongoose.connection.once('open', () => {
  //LOG
  console.log('Database connected!')

  // Init stream
  let gfs = Grid(mongoose.connection.db, mongoose.mongo)
  gfs.collection('media')
  module.exports.gfs = gfs

})

// Create storage engine
const storage = new GridFsStorage({
  db: connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err)
        }
        const filename = buf.toString('hex') + path.extname(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: 'media'
        }
        resolve(fileInfo)
      })
    })
  }
})

module.exports.media = multer({ storage }).single('media')
