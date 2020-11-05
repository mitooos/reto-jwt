const { mongoClient } = require('../lib/mongo')
const dbName = 'reto-jwt'
const usersCollection = 'users'
const bcrypt = require('bcrypt')

module.exports.getUsers = async (req, res) => {
  if (req.decoded.role !== 'admin' && req.decoded.role !== 'list') {
    res.status(401).send({
      success: false,
      message: 'Unauthorized to access resource'
    })
    return
  }

  const users = await mongoClient
    .db(dbName)
    .collection(usersCollection)
    .find({}, { projection: { password: 0 } })
    .toArray()

  res.send(users)
}

module.exports.createUser = async (req, res) => {
  if (req.decoded.role !== 'admin' && req.decoded.role !== 'create') {
    res.status(401).send({
      success: false,
      message: 'Unauthorized to access resource'
    })
    return
  }

  if (!req.body.username || !req.body.role || !req.body.password) {
    res.status(400).send({
      success: false,
      massage: 'There are missign fields in the request'
    })
    return
  }

  const isUsernameTaken = await mongoClient
    .db(dbName)
    .collection(usersCollection)
    .findOne({ username: req.body.username })

  if (isUsernameTaken) {
    res.status(409).send({
      success: false,
      message: 'Username is taken'
    })
    return
  }

  const saltRounds = 10
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err)
      res.status(500).send({
        success: false,
        message: 'Unable to hash password'
      })
      return
    }

    const result = await mongoClient
      .db(dbName)
      .collection(usersCollection)
      .insertOne({
        username: req.body.username,
        password: hash,
        role: req.body.role
      })

    res.send(result.ops)
  })
}
