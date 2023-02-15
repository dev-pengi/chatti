const express = require('express');
const router = express.Router()
const imgurUploadMiddleware = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.route('/').post(protect)

module.exports = router;