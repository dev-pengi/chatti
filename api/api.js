module.exports = (app) => {
    require('./auth/contacts')(app)
    require('./auth/contact')(app)
    require('./auth/send_message')(app)
}