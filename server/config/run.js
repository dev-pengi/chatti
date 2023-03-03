const mongoose = require('mongoose')
const colors = require("colors");

const { MONGO_URI } = process.env;
module.exports = async () => {
    try {
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    } catch (err) {
        console.log(`database connection failed. exiting now...`);
        process.exit(1);
    }

}