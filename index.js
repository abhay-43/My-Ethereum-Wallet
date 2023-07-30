
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { ethers } = require("ethers"); 
const crypto = require('crypto');
const {API_URL} = require('./config.js');
const { MONGO_URL } = require("./config.js");
const { user } = require("./config.js");
const { PROVIDER } = require("./config.js");
const { KEY, iv } = require("./config.js");
const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const encryptionKey = Buffer.from(KEY,'utf-8');
const IV = Buffer.from(iv,'utf-8'); // Create an initialization vector (IV) for additional security (16 bytes for AES-256)


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
    Mew_ID = null;
    res.sendFile(__dirname + "/connect.html");
})

app.get("/homepage",function(req,res){
    //sending homepage file
    const mew_id = req.cookies.mew_id;
    const ip = req.ip;
    if(Users[mew_id] && Users[mew_id].login && ip === Users[mew_id].ip)
    res.sendFile(__dirname + "/homepage.html");
    else res.send("Unauthorised access !");

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
  
       try{ 
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
      }catch(error){
        console.log(error);
      }
      });
    });
  });

  app.get('/balance',async function(req,res){
    const mew_id = req.cookies.mew_id;
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER);
    try{
      const account = await user.findOne({mew_id : mew_id});
      const balance = await provider.getBalance(account.wallet);
      const EtherBalance = ethers.utils.formatEther(balance);
      const Ether = {
        balance : (EtherBalance*1).toFixed(8)
      }
      // const ETH_USD = EtherBalance * currPrice;
      // const ETHinUSD = ETH_USD.toFixed(4);
      res.send(Ether);
    }catch(error){
      console.log(error);
    }
  });

  //send transaction
   // bug : showing previous info
   app.post('/send',async function(req,res){
    const to = req.body.toAddress;
    const amount = req.body.amount;
    const mew_id = req.cookies.mew_id;
    let txnUpdate;
    try{
      const txn = await sendTxn(mew_id, to, amount);
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
        update : "Transaction cannot be done!"
      }
    }
    res.send(txnUpdate);
  });

   //Transaction update 
  //  app.get('/txn-update',function(req,res){
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(txnUpdate);
  // });
   
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
    const account = await user.findOne({mew_id : from});
    const key = decryptData(account.pvt_key);
    const signer = new ethers.Wallet(key,provider); 
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

  //function for encryption
   function encryptData (data){
      // Create a cipher using AES-256-CBC algorithm
      const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, IV);
      // Encrypt the data
      let encryptedData = cipher.update(data, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');
      return encryptedData;
   }

  //function for decryption
   function decryptData (data){
      // To decrypt the data
      const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, IV);
      // Decrypt the data
      let decryptedData = decipher.update(data, 'hex', 'utf-8');
      decryptedData += decipher.final('utf-8');
      return decryptedData;
  }

const Users = {};
app.post('/verify', async function(req,res){
  const mew_id = req.body.mew_id;
  try{
    const available = await user.findOne({mew_id : mew_id});
    if(available){
      res.send(false);
    }else{
      const Wallet = CreateWallet();
      const wallet = Wallet.address;
      const pvt_key = encryptData(Wallet.privateKey);
      const mnemonic = encryptData(Wallet.mnemonic.phrase);
      await user.create({mew_id,wallet,pvt_key,mnemonic});
      res.cookie('mew_id', mew_id, { maxAge: twelveHoursInMilliseconds });
      Users[mew_id] = {
        login : true,
        ip : req.ip
      }
      res.send(true);
    }
  }catch(error){
    console.log(error);
  }
})

app.post('/exist', async function(req,res){
  const mew_id = req.body.mew_id;
  try{
    const available = await user.findOne({mew_id : mew_id});
    if(available) res.send(true);
    else res.send(false);
  }catch(error){
    console.log(error);
  }
})
//rather perfect add hollow citizen please glide child cheese bread cousin journey
app.post('/verify-mnemonic', async function(req,res){
  const mnemonic = req.body.mnemonic;
  const mew_id = req.body.mew_id;
  try{
    const account = await user.findOne({mew_id : mew_id});
    const decryptedMnemonic = decryptData(account.mnemonic);
    if(decryptedMnemonic === mnemonic){
      res.cookie('mew_id', mew_id, { maxAge: twelveHoursInMilliseconds });
      Users[mew_id] = {
        login : true,
        ip : req.ip
      }
      res.send(true);
    }
  }catch(error){
    console.log(error);
  }
});

app.get('/address', async function(req,res){
  const mew_id = req.cookies.mew_id;
  try{
    const account = await user.findOne({mew_id : mew_id});
    const address = {
      add : account.wallet
    }
    res.send(address);
  }catch(error){
    console.log(error);
  }
});

app.get('/info', async function(req,res){
  const mew_id = req.cookies.mew_id;
  try{
    const account = await user.findOne({mew_id : mew_id});
    const userInfo = {
      mew_id : mew_id,
      address : account.wallet,
      privateKey : decryptData(account.pvt_key),
      mnemonic : decryptData(account.mnemonic)
    }
    res.send(userInfo);
  }catch(error){
    console.log(error);
  }
});

app.get('/logout', async function(req,res){
  const mew_id = req.cookies.mew_id;
    delete Users[mew_id];
    res.clearCookie('mew_id');
    res.send(true);
});

app.listen(3000,function(){
    console.log("server started !!");
});