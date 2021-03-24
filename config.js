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
        useUnifiedTopology: true
    },
    MONGOOSE_URI: 'mongodb://localhost:27017/test',
    SESSION_OPTIONS: {
        secret: "secret key",
        resave: false,
        saveUninitialized: false
    },
    SOCKET_OPTIONS: {}
  }
