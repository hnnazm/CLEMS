module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || require('os').networkInterfaces()['wlan0'][0]['address'],
    PORT: process.env.PORT || 3000,
    COOKIES: {

    },
    EXPRESS_URLENCODED_OPTIONS: {
        extended: true 
    },
    MONGOOSE_OPTIONS: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    MONGOOSE_URI: 'mongodb://localhost:27017/clems',
    ROOM_PASSWORD: 'secret',
    SESSION_OPTIONS: {
        secret: "secret key",
        resave: false,
        saveUninitialized: false
    },
    SOCKET_OPTIONS: {}
  }
