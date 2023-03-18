const axios = require("axios");
const { IMGUR_CLIENT_ID } = process.env;

const imgurUpload = async (image) => {
    try {
        const response = await axios({
            method: "post",
            url: "https://api.imgur.com/3/image",
            headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                "Content-Type": "multipart/form-data",
            },
            data: {
                image: image,
                privacy: "hidden"
            },
            privacy: "hidden",
        });
        const { data } = response;
        return data.data.link;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = imgurUpload;
