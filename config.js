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
    user,
    KEY : [
        89,  13,  33,   7,  14, 210, 137, 176,
       179, 210, 251, 207, 159,  25,  70, 120,
       214, 253,  53,  25, 110,  66,  66,  94,
       221, 207, 174, 101, 209, 129, 189, 166
     ],
     iv : [
        1,  45,  24, 106, 251, 129,
      251, 114, 127,  34,  36,  24,
       10, 105, 188,  50
    ]
}