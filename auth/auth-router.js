const router = require('express').Router();
const db = require('./auth-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secrets = require('../secrets/secrets')

router.post('/register', (req, res) => {
  let user = req.body
  console.log(user)
  const hash = bcrypt.hashSync(user.password, 8)

  user.password = hash

  db.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post('/login', (req, res) => {
  let { username, password } = req.body

  db.findBy({ username })
    .first()
    .then(user => {

      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        res.status(200).json({ token })
      } else {
        res.status(401).json({ message: "you shall not pass!" })
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'no credentials provided', error: error })
    })
})

function generateToken(user) {
  const payload = {
    username: user.username
  }

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secrets.jwtSecret, options)

}

module.exports = router;
