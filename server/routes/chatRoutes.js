const express = require('express');
const { accessChatID, fetchChats, createGroupChat, accessChatUser, leaveGroup, updateGroup } = require('../controllers/chatControllers');
const { sendMessage, fetchMessages } = require('../controllers/messageController')
const router = express.Router()
const imgurUploadMiddleware = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.route('/user/:userID').get(protect, accessChatUser)
router.route('/:chatID').get(protect, accessChatID)
router.route('/').get(protect, fetchChats)
router.route('/groups/create').post(protect, createGroupChat)
router.route('/groups/:chatID').put(protect, imgurUploadMiddleware, updateGroup) // update group
router.route('/groups/:chatID').delete(protect, leaveGroup) // leave group


router.route('/:chatID/messages').post(protect, sendMessage)
router.route('/:chatID/messages').get(protect, fetchMessages)

module.exports = router;