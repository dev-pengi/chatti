const imgurUpload = require("../utilities/imgur");

const imgurUploadMiddleware = async (req, res, next) => {
    console.log('heyyy')
    try {
        console.log(req.files.img.data)
        const data = await imgurUpload(req.files.img.data);
        console.log(data)
        if (data) {
            req.image = data;
        }
        next();
    } catch (err) {
        console.log(err)
        return next();
    }
};

module.exports = imgurUploadMiddleware;
