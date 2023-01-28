const jwt = require('jsonwebtoken');
const user = require('../models/user');
const asyncHandler = require('express-async-handler');
const JWT_KEY = process.env.JWT_KEY

const protect = asyncHandler(async (req, res, next) => {
    let token;
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(" ")[1]

            //decodes token id
            const decoded = jwt.verify(token, JWT_KEY);
            const getUser = await user.findById(decoded.id).select('-password');
            if (!getUser) {
                res.status(401);
                throw new Error("Not authorized, invalid token")
            }
            req.user = getUser;
            next();
        } catch (err) {
            res.status(401);
            throw new Error("Not authorized, invalid token")
        }
    }
    else {
        res.status(401);
        throw new Error("Not authorized, no token provided")
    }
})

module.exports = { protect }