const contacts = require('../../models/contacts');
const users = require('../../models/users')
const tools = require('../../events/tools')
module.exports = (app) => {
    app.get('/api/user/contact/:id', async (req, res) => {
        if (!req.user) return res.status(401).send({ error: 401, reason: 'this action requires login' });
        const user1_json = req.user._json;
        const user2 = await users.findOne({ id: req.params.id });
        if (!user2) return res.status(405).send({ error: 405, reason: 'this user cannot be found' });

        const user1 = await users.findOne({ id: user1_json.sub });
        if (!user1) return res.status(401).send({ error: 401, reason: 'try to login again to create your account' });

        let chat_id = tools.chat_id(user1.id, user2.id)
        let chat_data = await contacts.findOne(
            {
                id: chat_id,
            }
        )
        if (!chat_data) chat_data = await contacts.create(
            {
                id: chat_id,
            }
        )
        const data = {
            messages: chat_data.messages,
            user1: user1,
            user2: user2,
        }
        res.status(200).send(data);
    })
}