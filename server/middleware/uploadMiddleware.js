const imgurUpload = require("../utilities/imgur");

const imgurUploadMiddleware = async (req, res, next) => {
    console.log('heyyy')
    try {
        if (!req.files.img.data) return next();
        const data = await imgurUpload(req.files.img.data);
        console.log(data)
        if (data) {
            req.image = data;
        }
    } catch (err) {
        console.log(err);
    } finally {
        next();
    }
};

module.exports = imgurUploadMiddleware;
