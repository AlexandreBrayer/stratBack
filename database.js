const database = {}
require('dotenv').config()

database.connect = async() => {
    const mongoose = require("mongoose")
    mongoose.connect(process.env.DB_CON, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        () => console.log('con'));

}

module.exports = database