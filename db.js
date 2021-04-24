const config = require('./config')
const mongoose = require('mongoose')

mongoose.connect(config.MONGOOSE_URI, config.MONGOOSE_OPTIONS)

const db = mongoose.connection
//LOG: db.on('error', () => console.error('Error connecting to database:'))
db.once('open', () => {
  //LOG
  console.log('Database connected!')
})
