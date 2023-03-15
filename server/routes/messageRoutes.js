const express = require('express');
const router = express.Router()
const { generateMessage } = require('../controllers/messageController')
const imgurUploadMiddleware = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware')

router.route('/ai/generate').post(protect, generateMessage)

module.exports = router;