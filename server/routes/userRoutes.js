const express = require('express');
const router = express.Router()
const { registerUser, authUser, allUsers } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.post('/register', registerUser)
router.post('/login', authUser)
router.route('/').get(protect, allUsers)

module.exports = router;