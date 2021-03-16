// middleware function

function checkAuthentication(req, res, next) {
    if (req.session.isAuthenticate) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    checkAuthentication
}