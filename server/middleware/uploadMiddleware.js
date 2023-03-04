const imgurUpload = require("../utilities/imgur");

const imgurUploadMiddleware = async (req, res, next) => {

    try {
        const data = await imgurUpload(req.files.img.data);
        if (data) {
            req.image = data;
        }
        next();
    } catch (err) {
        return next();
    }
};

module.exports = imgurUploadMiddleware;
