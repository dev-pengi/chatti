const contacts = require('../../models/contacts')
const users = require('../../models/users')
const tools = require('../../events/tools')
const { user } = require('../../events/check')
module.exports = (app) => {
    app.post('/api/user/chat/:id/messages/send', async (req, res) => {
        if (!req.user) return res.status(401).send({ error: 401, reason: 'this action requires login' });
        if (!req.body) return res.status(401).send({ error: 401, reason: 'invalid data' })
        const user1 = await users.findOne({ id: req.user._json.sub });
        const user2 = await users.findOne({ id: req.params.id });
        if (!user2) return res.status(405).send({ error: 405, reason: 'this user cannot be found' });
        if (!user1) return res.status(401).send({ error: 401, reason: 'this action requires login' });

        if (user1.id == user2.id) return res.status(401).send({ error: 401, reason: 'you can\'t text yourself..' });
        const message = {
            message: req.body.message,
            createdOn: Date.now(),
            by: user1.id,
            type: 'text',
        }
        let chat_id = tools.chat_id(user1.id, user2.id)
        let chat_data = await contacts.findOneAndUpdate(
            {
                id: chat_id,
            },
            {
                $push: { messages: message }
            },
            {
                upsert: true,
                new: true
            }).catch(err => { return });
        if (!chat_data) return res.status(405).send({ error: 401, reason: 'internal server error' });
        res.status(200).send('OK')

        if (!user1.contacts.includes(user2.id)) {
            const doc = await users.findOneAndUpdate(
                {
                    id: user1.id,
                    contacts: { $nin: [user2.id] },
                },
                {
                    $push: { contacts: user2.id },
                }
            )
        } 
        if (!user2.contacts.includes(user1.id)) {
            const doc = await users.findOneAndUpdate(
                {
                    id: user2.id,
                    contacts: { $nin: [user1.id] },
                },
                {
                    $push: { contacts: user1.id },
                }
            )
        }
    })
}