const contacts = require('../../models/contacts')
const users = require('../../models/users')
const { chat_id } = require('../../events/tools')
module.exports = (app) => {
    app.get('/api/user/contacts', async (req, res) => {
        if (!req.user) return res.status(401).send({ error: 401, reason: 'this action requires login' });


        const user = await users.findOne({ id: req.user._json.sub });
        if (!user || !user.contacts) return res.status(200).send({ status: 'OK', data: [] });

        let contacts_arr = []
        for (let i = 0; i < user.contacts.length; i++) {
            let get_contacts_data = await users.findOne({ id: user.contacts[i] });
            if (!get_contacts_data) continue;
            const contact_data = {
                id: get_contacts_data.id,
                avatar: get_contacts_data.avatar,
                name: get_contacts_data.name,
                email: get_contacts_data.email,
            }
            let chat = await contacts.findOne({ id: chat_id(user.id, get_contacts_data.id) });
            if (chat && chat.messages.length) {
                contact_data.last_msg = chat.messages.sort((a, b) => b.createdOn - a.createdOn)[0]
            }
            contacts_arr.push(contact_data);
        }

        res.status(200).send({ status: 'OK', data: contacts_arr });
    })
}