
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const { ethers } = require("ethers");

const {KEY} = require('./config.js');
const { dirname } = require("path");
const app = express();
let user;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
    //sending connect file
    res.sendFile(__dirname + "/connect.html");
})

app.get("/homepage",function(req,res){
    //sending homepage file
    res.sendFile(__dirname + "/homepage.html");

  })
  app.post('/user',function(req,res){
    user = req.body.wallet;
    console.log("User : " +user);
    res.send("ok");
});

app.get('/data', function(req, res) {
    // API request
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY="+KEY+"&symbol=ETH&convert=USDT";
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

  // app.get('/connect',async function(req,res){
  //   const ConnectedWallet = await Connect();
  //   console.log(ConnectedWallet);
  //   res.sendFile(__dirname + "/homepage.html");
  // });

  //create wallet function
  // function CreateWallet(){
  //   const wallet = ethers.Wallet.createRandom();
  //   return wallet;
  // }

app.listen(3000,function(){
    console.log("server started !!");
});