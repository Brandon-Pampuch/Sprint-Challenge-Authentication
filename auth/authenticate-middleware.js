const jwt = require('jsonwebtoken')
const secrets = require('../secrets/secrets')

module.exports = function (req, res, next) {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "invalid credentials" })
      } else {
        // can return user
        req.user = { id: decodedToken.id, username: decodedToken.username }
        // req.account = {  id: decodedToken.id, username: decodedToken.username } <--- ref. from pot luck
        //this is how you link tables in every request
        next()
      }
    })

  } else {
    res.status(400).json({ message: 'no credentials' })
  }
}
