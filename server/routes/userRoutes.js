const express = require('express');
const router = express.Router()
const { registerUser, authUser, allUsers, getUser, UpdateSettings, blockUser, RemoveBlockUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const imgurUploadMiddleware = require('../middleware/uploadMiddleware');
// router.route('/').post()

router.post('/register', registerUser)
router.post('/login', authUser)
router.route('/').get(protect, allUsers)
router.route('/:userID').get(protect, getUser)
router.route('/settings').post(protect, imgurUploadMiddleware, UpdateSettings)
router.route('/block/:userID').post(protect, blockUser).delete(protect, RemoveBlockUser)

module.exports = router;