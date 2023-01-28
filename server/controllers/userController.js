const asyncHandler = require('express-async-handler');
const user = require('../models/user');
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
        res.status(400)
        throw new Error("Please enter all fields");
    }

    const getUser = await user.findOne({ email: email })
    if (getUser) {
        res.status(400);
        throw new Error("email has already been used");
    }
    const newUser = await user.create({
        name,
        email,
        password,
    })

    if (!user) {
        res.status(400);
        throw new Error("Failed to create the account");
    }

    res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        token: generateToken(newUser._id)
    })
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const getUser = await user.findOne({ email })
    if (!getUser) {
        res.status(400);
        throw new Error("there is no user with this email");
    }

    const match = await getUser.matchPassword(password)
    if (!match) {
        res.status(400);
        throw new Error("incorrect password");
    }

    res.status(200).json({
        _id: getUser._id,
        name: getUser.name,
        email: getUser.email,
        avatar: getUser.avatar,
        token: generateToken(getUser._id)
    })


})

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search;
    const search = keyword ? {
        $or: [
            { name: { $regex: keyword, $options: "i" }, },
            { email: keyword }
        ]
    } : {};

    const users = await user.find(search).find({ _id: { $ne: req.user._id } }).select('-password');
    res.send(users)
})

const getUser = asyncHandler(async (req, res) => {
    const { userID } = req.params;
    if (userID == "@me") {
        const getUser = await user.findById(req.user._id).select('-password');
        if (!getUser) {
            res.status(404);
            throw new Error('User can\'t be not found')
        }
        res.status(200).json(getUser);
    }
    else {
        res.status(404);
        throw new Error('User can\'t be not found')
    }
})

module.exports = { registerUser, authUser, allUsers, getUser }