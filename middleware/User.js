function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    else {
      res.send('error please login')
    }
  }
}

module.exports = {
  authenticationMiddleware
}
