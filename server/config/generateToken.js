const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_KEY)
}

module.exports = generateToken