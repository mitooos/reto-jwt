const jwt = require('jsonwebtoken')
const config = require('../config.js')

module.exports.checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length)
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          })
        } else {
          req.decoded = decoded
          next()
        }
      })
    }
  } else {
    return res.json({
      success: false,
      message: 'Token is not valid'
    })
  }
}
