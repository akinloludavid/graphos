const express = require('express')
const router = express.Router()
const upload = require('../utils/multer');

const {
  createAccount,
  logIn,
  updateUserProfile,
  uploadProfileImage
} = require('../controllers/auth')
const {userAuth} = require('../middleware/authentication')

router.post('/signup', createAccount)
router.post('/login', logIn)

router.put('/update/:id', userAuth, updateUserProfile)
router.put('/uploadavatar/:id', userAuth, upload.single("image"), uploadProfileImage)
module.exports = router;