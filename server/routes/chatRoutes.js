const express = require('express');
const { accessChatID, fetchChats, createGroupChat, accessChatUser, leaveGroup, updateGroup } = require('../controllers/chatControllers');
const router = express.Router()

const { registerUser, authUser, allUsers } = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.route('/user/:userID').get(protect, accessChatUser)
router.route('/:chatID').get(protect, accessChatID)
router.route('/').get(protect, fetchChats)
router.route('/groups/create').post(protect, createGroupChat)
router.route('/groups/:chatID').put(protect, updateGroup) // update group
router.route('/groups/:chatID').delete(protect, leaveGroup) // leave group

module.exports = router;