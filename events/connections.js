const mongoose = require('mongoose')
module.exports.database = async (client) => {
    return await mongoose.connect(process.env.MONGODB)
        .then(result => {
            console.log(`Connected to the database`)
        })
        .catch(console.error);
}