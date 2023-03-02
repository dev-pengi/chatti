const asyncHandler = require('express-async-handler');
const user = require('../models/user');
const chat = require('../models/chat');






const accessChatUser = asyncHandler(async (req, res) => {
    const { userID } = req.params;

    if (!userID) {
        res.status(400);
        throw new Error('invalid id')
    }

    let isChat = await chat.find({
        isGroup: { $ne: true },
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userID } } }
        ]
    })
        .populate('users', "-password")
        .populate('lastMessage');

    isChat = await user.populate(isChat, {
        path: "lastMessage.sender",
        select: '-password'
    })

    if (isChat.length) {
        res.send(isChat[0])
    }
    else {
        let chatData = {
            name: "sender",
            isGroupChat: false,
            users: [req.user._id, userID]
        };
        try {
            const createdChat = await chat.create(chatData);
            const fullChat = await chat.findOne({ _id: createdChat._id })
                .populate('users', "-password")

            res.status(200).send(fullChat);
        } catch (err) {
            res.status(400)
            throw new Error(err.message)
        }
    }
})
const accessChatID = asyncHandler(async (req, res) => {
    const { chatID } = req.params;

    if (!chatID) {
        res.status(400);
        throw new Error('invalid chat id')
    }

    let isChat = await chat.findOne({
        $and: [
            { _id: chatID },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    })
        .populate('users', "-password")
        .populate("groupAdmin", "-password")
        .populate('lastMessage');

    isChat = await user.populate(isChat, {
        path: "lastMessage.sender",
        select: '-password'
    })
    if (!isChat) {
        res.status(400)
        throw new Error('This chat is invailable')
    };

    res.send(isChat)
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        let search = req.query.search;
        let chats;
        if (search) {
            let populatedChats = await chat.find({
                users: { $elemMatch: { $eq: req.user._id } }
            })
                .populate('groupAdmin', "-password")
                .populate('lastMessage')
                .sort({ updatedAt: -1 });

            populatedChats = await user.populate(populatedChats, {
                path: "users",
                select: '-password'
            });

            chats = populatedChats.filter((chat) => {
                return chat.users.some((user) => {
                    return JSON.stringify(user, ['name', '_id']).match(new RegExp(search, 'i')) && (user._id !== req.user._id);
                });
            });
        } else {
            chats = await chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                .populate('users', "-password")
                .populate('groupAdmin', "-password")
                .populate('lastMessage')
                .sort({ updatedAt: -1 })
        }

        chats = await user.populate(chats, {
            path: "lastMessage.sender",
            select: 'name pic email'
        })

        res.status(200).send(chats)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})




const createGroupChat = asyncHandler(async (req, res) => {
    let { users, name } = req.body;
    if (!name) {
        res.status(400)
        throw new Error('Group name is required')
    }
    if (!users) {
        res.status(400)
        throw new Error('It requires at least to add 2 users to create a group chat')
    }

    for (let i = 0; i < users.length; i++) {
        const checkUser = await user.findOne({ _id: users[i] })
        if (!checkUser) {
            res.status(400)
            throw new Error('one of the added users doesn\'t exists')
        }
    }
    const avt = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'

    if (users.length < 2) {
        res.status(400)
        throw new Error('It requires at least to add 2 users to create a group chat')
    }
    users.push(req.user._id);

    try {
        const groupChat = await chat.create({
            name: name,
            users: users,
            isGroup: true,
            avatar: avt,
            groupAdmin: req.user._id,
        })
        const fullGroupChat = await chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).send(fullGroupChat)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

const updateGroup = asyncHandler(async (req, res) => {
    let { name, users } = req.body;
    let { chatID } = req.params;
    const avt = req.image;
    const update = {}
    try {
        users = JSON.parse(users);
        name = JSON.parse(name);

        const checkGroup = await chat.findOne(
            {
                _id: chatID,
                isGroup: { $eq: true },
            }
        )
        if (!checkGroup) {
            res.status(400)
            throw new Error('Group not found')
        }
        users = [...users, req.user._id.toString()]
        users = users.filter((item, index) => {
            return users.indexOf(item) === index;
        });

        if (users && users.length && JSON.stringify(checkGroup.users.map(u => u._id.toString())) !== JSON.stringify(users)) {
            if (!req.user._id.equals(checkGroup.groupAdmin)) {
                res.status(401)
                throw new Error('Only group admin could add/remove users')
            }

            for (let i = 0; i < checkGroup.users.length; i++) {
                const checkUser = await user.findOne({ _id: checkGroup.users[i] })
                if (!checkUser) {
                    res.status(400)
                    throw new Error('one of the added users doesn\'t exists')
                }
            }
            update.users = users
        }
        if (checkGroup.name != name) {
            if (!name || !name.trim().length) {
                res.status(400)
                throw new Error('Please use a valid name')
            }
            update.name = name
        }
        if (avt) {
            update.avatar = avt
        }

        const updatedChat = await chat.findOneAndUpdate(
            {
                _id: chatID,
                isGroup: { $eq: true },
            },
            {
                ...update
            },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if (!updatedChat) {
            res.status(400)
            throw new Error('Group not found')
        }
        else {
            res.json(updatedChat)
        }
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }

})
const leaveGroup = asyncHandler(async (req, res) => {
    let { chatID } = req.params;

    const removed = await chat.findOneAndUpdate(
        {
            _id: chatID,
            isGroup: { $eq: true },
        },
        {
            $pull: { users: req.user._id },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")


    if (!removed) {
        res.status(400)
        throw new Error('Group not found')
    }
    else {
        res.status(200).send('Succesffuly left the group')
    }
})

module.exports = {
    accessChatID,
    fetchChats,
    createGroupChat,
    updateGroup,
    accessChatUser,
    leaveGroup
}