const express = require('express')
const router = express.Router()

const {createAccount, logIn} = require('../controllers/auth')


router.post('/signup', createAccount)

router.post('/login', logIn)

module.exports = router;