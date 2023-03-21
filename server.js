
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.get("/",function(req,res){

    //sending connect file
    res.sendFile(__dirname + "/connect.html");

})

app.get("/homepage.html",function(req,res){
    
    //sending homepage file
    res.sendFile(__dirname + "/homepage.html");

    //API request
    const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=970d4991-d793-4b3b-8eac-5e6871d65a04&symbol=ETH&convert=USDT";
    https.get(url,function(response){
        response.on("data",function(data){

            const ETHdata = JSON.parse(data);
            const P = ETHdata.data.ETH.quote.USDT.price;
            const Price = P.toFixed(2); //Price
            const PC1D = ETHdata.data.ETH.quote.USDT.percent_change_24h;
            const PercentChange24H = PC1D.toFixed(2); //24H change
            const PC7D = ETHdata.data.ETH.quote.USDT.percent_change_7d;
            const PercentChange7D = PC7D.toFixed(2); //7D change
            const MC = ETHdata.data.ETH.quote.USDT.market_cap;
            const MarketCap = MC.toFixed(2); //Market cap
            const V24H = ETHdata.data.ETH.quote.USDT.volume_24h;
            const Volume24H = V24H.toFixed(2); //Volume
            console.log(Price);

        })
    })
})

app.listen(3000,function(){
    console.log("server started !!");
});