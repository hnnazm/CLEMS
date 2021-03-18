module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,
    COOKIES: {

    },
    SESSION_OPTION: {
        secret: "secret key",
        resave: false,
        saveUninitialized: false
    },
    SOCKET_OPTION: {}
  }