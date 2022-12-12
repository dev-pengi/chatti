module.exports.user = (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return false;
    }
    return true;
}