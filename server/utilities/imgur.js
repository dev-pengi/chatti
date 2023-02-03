const axios = require('axios');

const config = {
    headers: {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/octet-stream',
    }
};

const uploadImageToImgur = async (imageBuffer) => {
    try {
        const { data } = await axios.post('https://api.imgur.com/3/image', imageBuffer, config);
        console.log(data)
        return data.data.link;
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
        throw new Error('Error uploading image');
    }
};

module.exports = { uploadImageToImgur };
