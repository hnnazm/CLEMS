module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
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
    MONGOOSE_URI: 'mongodb://mongodb/test',
    ROOM_PASSWORD: 'secret',
    SESSION_OPTIONS: {
        secret: "secret key",
        resave: false,
        saveUninitialized: false
    },
    SOCKET_OPTIONS: {}
  }
