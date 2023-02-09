const express = require('express');
const { accessChatID, fetchChats, createGroupChat, renameGroup, addGroupMember, removeGroupMember,accessChatUser } = require('../controllers/chatControllers');
const router = express.Router()

const { registerUser, authUser, allUsers } = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.route('/user/:userID').get(protect, accessChatUser)
router.route('/:chatID').get(protect, accessChatID)
router.route('/').get(protect, fetchChats)
router.route('/group/create').post(protect, createGroupChat)
router.route('/group/rename').put(protect, renameGroup)
router.route('/group/add').put(protect, addGroupMember)
router.route('/group/remove').put(protect, removeGroupMember)

module.exports = router;