const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addGroupMember, removeGroupMember } = require('../controllers/chatControllers');
const router = express.Router()

const { registerUser, authUser, allUsers } = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')
// router.route('/').post()

router.route('/:userID').get(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group/create').post(protect, createGroupChat)
router.route('/group/rename').put(protect, renameGroup)
router.route('/group/add').put(protect, addGroupMember)
router.route('/group/remove').put(protect, removeGroupMember)

module.exports = router;