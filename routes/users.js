const express = require('express')
const router = express.Router()
const { checkToken } = require('../middlewares/checkToken.js')

const usersController = require('../controllers/users.js')

router.get('/', checkToken, usersController.getUsers)
router.post('/', checkToken, usersController.createUser)

module.exports = router
