const mongoose = require('mongoose')
const colors = require("colors");

const { MONGO_URI, PORT } = process.env;
module.exports = async (app) => {

    app.listen(PORT, () => {
        console.log(`Server is runnig on ${PORT}`.green);
    })

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