const express = require('express');
const router = express.Router()
const { registerUser, authUser, allUsers, getUser, UpdateSettings } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.post('/register', registerUser)
router.post('/login', authUser)
router.route('/').get(protect, allUsers)
router.route('/:userID').get(protect, getUser)
router.route('/settings').post(protect, UpdateSettings)

module.exports = router;