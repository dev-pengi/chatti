const contacts = require('../../models/contacts')
const users = require('../../models/users')
const { chat_id } = require('../../events/tools')
module.exports = (app) => {
    app.get('/api/search', async (req, res) => {
        if (!req.user) return res.status(401).send({ error: 401, reason: 'this action requires login' });

        const user = await users.findOne({ id: req.user._json.sub });
        if (!user) return res.status(401).send({ error: 401, reason: 'try to login again to create your account' });

        const keyword = req.query.search;
        if (!keyword) return res.status(405).send({ error: 405, reason: 'please provide a keyword to search for' });

        const results = await users.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' }, },
                { email: keyword },
                { id: keyword }
            ]
        })

        res.status(200).send(results)






    })
}