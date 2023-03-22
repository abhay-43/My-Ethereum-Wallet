
//fetching json from server
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    document.getElementById('price').innerHTML =' <b>Price : $</b>'+data.price;
    document.getElementById('24hc').innerHTML =' <b>24H Change : </b>'+data.percentchange24h+'%';
    document.getElementById('7dc').innerHTML =' <b>7D change : </b>'+data.percentchange7d+'%';
    document.getElementById('mc').innerHTML =' <b>Market Cap : $</b>'+data.marketcap;
    document.getElementById('v').innerHTML =' <b>Volume : $</b>'+data.volume;
    
  } catch (error) {
    console.error(error);
  }
}

window.onload = async function() {
  //Redirect to homepage on connecting the wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const cntBtn = document.getElementById('CntBtn');
    if (cntBtn) {
      cntBtn.onclick = async function(){
        await provider.send("eth_requestAccounts",[]);
        const signer = provider.getSigner();
        window.location.replace("/homepage.html");
      }
    }

    //updating data of ETH
    // getData();
    // setInterval(getData,60000);
    
    //Redirect to connect page on disconnecting the wallet
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            window.location.href = "/";
        }
    })
    
  };

  
  
  