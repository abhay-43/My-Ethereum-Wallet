
//fetching json from server
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    document.getElementById('price').innerHTML =' <b>Price : $</b>'+data.price;
    if(data.percentchange24h >= 0)
    document.getElementById('24hc').innerHTML =' <b>24H Change : </b> <span style="color: green;">'+data.percentchange24h+'% </span>';
    else
    document.getElementById('24hc').innerHTML =' <b>24H Change : </b> <span style="color: red;">'+data.percentchange24h+'% </span>';
    if(data.percentchange7d >= 0)
    document.getElementById('7dc').innerHTML =' <b>7D change : </b> <span style="color: green;">'+data.percentchange7d+'% </span>';
    else
    document.getElementById('7dc').innerHTML =' <b>7D change : </b> <span style="color: red;">'+data.percentchange7d+'% </span>';
    document.getElementById('mc').innerHTML =' <b>Market Cap : $</b>'+data.marketcap+"B";
    document.getElementById('v').innerHTML =' <b>Volume : $</b>'+data.volume+"B";
    
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
        const walletAddress = await signer.getAddress();
        console.log(walletAddress);
        localStorage.getItem('redirected',true);
        window.location.replace("/homepage");
      }
    }

    //updating data of ETH
    // if(localStorage.getItem('redirected') === true){
      getData()
     setInterval(getData,60000);
    // }
    
    //Redirect to connect page on disconnecting the wallet
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            window.location.href = "/";
        }
    })
    
  };

  
  
  