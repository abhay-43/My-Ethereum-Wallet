const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    wallet : {
        type : String,
        required : true
    },
    mew_id : {
        type : String,
        required : true
    },
    pvt_key : {
        type : String,
        required : true
    }
});

const user = mongoose.model('user', userSchema);

module.exports = {
    API_URL: process.env.API_URL,
    MONGO_URL: process.env.MONGO_URL,
    PROVIDER: process.env.PROVIDER,
    user
};
