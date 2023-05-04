
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require('mongoose');

const { ethers } = require("ethers"); 

const {API_URL} = require('./config.js');
const { MONGO_URL } = require("./config.js");
const { user } = require("./config.js");
const { PROVIDER } = require("./config.js");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to database
async function ConnectDB(){
  try{
    await mongoose.connect(MONGO_URL);
    console.log("Database in connected...");
  }catch(error){
    console.log("Error while connecting database...");
  }
}
ConnectDB();

app.get("/",function(req,res){
    //sending connect file
    res.sendFile(__dirname + "/connect.html");
})

app.get("/homepage",function(req,res){
    //sending homepage file
    res.sendFile(__dirname + "/homepage.html");

  })

  let Mew_ID;
  app.post('/user',async function(req,res){
    const account = req.body.wallet;
    console.log("User : " +account);
    let present = await ValidateUser(account);
    if(present == null){
      const mew_id = CreateWallet();
      const newUser = new user({
        wallet : account,
        mew_id : mew_id.address,
        pvt_key : mew_id.privateKey
      });
       present = await newUser.save();
    }
    Mew_ID = {
      add : present.mew_id
    }
    res.send("ok");
});

app.get('/data', function(req, res) {
    // API request
    const url = API_URL;
    https.get(url, function(response){
      response.on('data', function(data){
  
        const ETHdata = JSON.parse(data);
        const P = ETHdata.data.ETH.quote.USDT.price;
        const Price = P.toFixed(2); //Price
        const PC1D = ETHdata.data.ETH.quote.USDT.percent_change_24h;
        const PercentChange24H = PC1D.toFixed(2); //24H change
        const PC7D = ETHdata.data.ETH.quote.USDT.percent_change_7d;
        const PercentChange7D = PC7D.toFixed(2); //7D change
        const MC = ETHdata.data.ETH.quote.USDT.market_cap / 10e9;
        const MarketCap = MC.toFixed(2); //Market cap
        const V24H = ETHdata.data.ETH.quote.USDT.volume_24h / 10e9;
        const Volume24H = V24H.toFixed(2); //Volume
  
        // Create a JSON object with the data
        const dataToSend = {
          price: Price,
          percentchange24h: PercentChange24H,
          percentchange7d: PercentChange7D,
          marketcap: MarketCap,
          volume: Volume24H
        };
  
        // Set the Content-Type header to "application/json"
        res.setHeader('Content-Type', 'application/json');
        // Send the JSON object as a response
        res.send(dataToSend);
      });
    });
  });

  app.get('/mew_id',function(req,res){
   res.setHeader('Content-Type','application/json');
   res.send(Mew_ID);
   console.log(Mew_ID);
  });

  //send transaction
  app.post('/send',async function(req,res){
    const to = req.body.toAddress;
    const amount = req.body.amount;
    let txnUpdate;
    try{
      const from = Mew_ID.add;
      const txn = await sendTxn(from, to, amount);
      console.log("Txn done");
      if(txn.hash == undefined){
        // res.send("Transaction rejected due to " +txn.reason+".");
        txnUpdate = {
          type : 0,
          update : txn.reason
        }
      }else{
        // res.send("Transaction done with Txn hash: "+txn.hash);
        txnUpdate = {
          type : 1,
          update : txn.hash
        }
      }
    }catch(error){
      // res.send("Transaction cannot be done without connecting wallet!");
      txnUpdate = {
        type : -1,
        update : "Transaction cannot be done without connecting wallet!"
      }
    }

    //Transaction update 
  app.get('/txn-update',function(req,res){
    res.send(txnUpdate);
  });

  });

  //create wallet function
  function CreateWallet(){
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }

  //check user exist or not ?
  async function ValidateUser(address){
    const present = await user.findOne({wallet : address});
    return present;
  }
 
  //function to send transaction
  async function sendTxn(from, to, amount){
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    const wallet = await user.findOne({mew_id : from});
    const signer = new ethers.Wallet(wallet.pvt_key,provider); 
    try{
      const txn = {
        to : to,
        value : ethers.utils.parseEther(amount),
        gasLimit : 21000 
        }
    const txnStatus = await signer.sendTransaction(txn);
    return txnStatus;
    }catch(error){
      console.log(error);
      return error;
    }
  }

app.listen(3000,function(){
    console.log("server started !!");
});