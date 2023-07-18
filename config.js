const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mew_id : {
        type : String,
        required : true
    },
    wallet : {
        type : String,
        required : true
    },
    pvt_key : {
        type : String,
        required : true
    },
    mnemonic : {
        type : String,
        required : true
    }
});

const user = mongoose.model('user',userSchema);
module.exports = {
    API_URL : 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=970d4991-d793-4b3b-8eac-5e6871d65a04&symbol=ETH&convert=USDT',
    MONGO_URL :'mongodb+srv://mew:mew12345@accounts.0h9engc.mongodb.net/?retryWrites=true&w=majority',
    PROVIDER : 'https://sepolia.infura.io/v3/2881ee9fd5b04bbab9da5fe590e1bb6c',
    user
}