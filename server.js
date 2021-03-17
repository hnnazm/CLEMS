const config = require('./config')
const express = require('express')
const path = require('path')
const route = require('./route')
const session = require('express-session')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(session(config.SESSION_OPTION))
app.use(express.static(path.join(__dirname, 'public'), {index: false}))

app.use('/', route)


app.listen(config.PORT, config.HOST, () => {
    console.log(`Server is running on port ${config.PORT}`)
})