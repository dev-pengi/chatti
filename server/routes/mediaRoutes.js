const express = require('express');
const router = express.Router()
const { uploadImage } = require('../controllers/mediaController')
const { protect } = require('../middleware/authMiddleware')


router.post('/upload', protect, allUsers)

module.exports = router;