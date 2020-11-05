const jwt = require('jsonwebtoken')
const config = require('../config')
const { mongoClient } = require('../lib/mongo')
const bcrypt = require('bcrypt')

const dbName = 'reto-jwt'
const usersCollection = 'users'

module.exports.login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    const user = await mongoClient
      .db(dbName)
      .collection(usersCollection)
      .findOne({ username: req.body.username })

    const incorrectUsernameOrPasswordResponse = {
      success: false,
      message: 'Incorrect username or password'
    }

    if (!user) {
      res.status(403).send(incorrectUsernameOrPasswordResponse)
      return
    }
    const matchPasswords = await bcrypt.compare(password, user.password)

    if (username === user.username && matchPasswords) {
      const token = jwt.sign({ username: user.username, role: user.role }, config.secret, { expiresIn: '24h' })
      res.send({
        success: true,
        message: 'Authenticated',
        token: token
      })
    } else {
      res.status(403).send(incorrectUsernameOrPasswordResponse)
    }
  } else {
    res.status(400).send({
      success: false,
      message: 'Bad request'
    })
  }
}
