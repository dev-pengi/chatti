const contacts = require('../../models/contacts')
const users = require('../../models/users')
module.exports = (app) => {
    app.get('/api/user/contacts', async (req, res) => {
        if (!req.user) return res.status(401).send({ error: 401, reason: 'this action requires login' });
        const user = req.user._json;

        const user_data = await users.findOne({ id: user.sub });
        if (!user_data || !user_data.contacts) return res.status(200).send({ status: 'OK', data: [] });

        let contacts_arr = []
        for (let i = 0; i < user_data.contacts.length; i++) {
            let get_contacts_data = await users.findOne({ id: user_data.contacts[i] });
            if (!get_contacts_data) continue;
            const contact_data = {
                id: get_contacts_data.id,
                avatar: get_contacts_data.avatar,
                name: get_contacts_data.name,
                email: get_contacts_data.email,
            }
            contacts_arr.push(contact_data);
        }

        res.status(200).send({ status: 'OK', data: contacts_arr });
    })
}