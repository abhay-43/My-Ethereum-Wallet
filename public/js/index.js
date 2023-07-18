

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
let currPrice;


//connect button action
async function connect(){
  await provider.send("eth_requestAccounts",[]);
  // const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  console.log(walletAddress);
  const data = {
    wallet : walletAddress
  }
  localStorage.setItem('redirected',true);
  const response = await fetch("http://localhost:3000/user",{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
      await response.text();
      window.location.replace("/homepage");
}

//fetching json from server
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    currPrice = data.price;
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

//fetching wallet address from database
async function getMew_ID() {
  try{
    const response = await fetch('http://localhost:3000/mew_id');
    const data = await response.json();
    document.getElementById('disCntBtn').textContent = "Account";
    document.getElementById('myaddress').value = data.add;
    }catch(error){
      console.log(error);
    }
}

//updating balance
async function UpdateBalance(){
  try{
    const response = await fetch('http://localhost:3000/mew_id');
    const data = await response.json();
    const balance = await provider.getBalance(data.add);
    const EtherBalance = ethers.utils.formatEther(balance);
    const Ether = (EtherBalance*1).toFixed(8);
    const ETH_USD = EtherBalance * currPrice;
    const ETHinUSD = ETH_USD.toFixed(4);
    document.getElementById('balance').innerHTML = Ether+' ETH ≈ $'+ETHinUSD;
  }catch(error){
    console.log(error);
  }
}

//view transaction function
async function viewTransaction(){
  try{
    const response = await fetch('http://localhost:3000/mew_id');
    const data = await response.json();
    window.open('https://sepolia.etherscan.io/address/'+data.add, '_blank');
  }catch(error){
    console.log(error);
  }
}

//fetching transaction update
async function TxnUpdate(){
  try{
    const response = await fetch('http://localhost:3000/txn-update');
    const data = await response.json();
    if(data.type == 0){
      var click = alert("Transaction rejected! \n Reason: "+data.update);
      if(!click){
        location.reload();
      }
    }
    else if(data.type == 1){
      var click = alert("Transaction done! \n TxnHash: "+data.update);
      if(!click){
        location.reload();
      }
    }
    else if(data.type == -1){
      var click = alert(data.update);
      if(!click){
        location.reload();
      }
    }
    else{
      var click = alert("Unknown Error Occured!");
      if(!click){
        location.reload();
      }
      
    }
    console.log("hello");
  }catch(error){
    console.log(error);
  }
}



window.onload = async function() {

  //Redirect to homepage on connecting the wallet
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const cntBtn = document.getElementById('CntBtn');
    if (cntBtn) {
      cntBtn.onclick = connect;
    }

    //disconnect wallet hint 
   if( document.getElementById('disCntBtn').textContent == "Connected"){
    document.getElementById('disCntBtn').onclick = function (){
      var click= alert('You can manually disconnect your wallet !\n\nFollow steps :\n\n Open metamask -> Tap "connected" -> Tap three dots (⋮) \n  -> Tap "Disconnect this account"');
      if(click){}
      else{
        location.reload();
      }
    }
  }else{
    document.getElementById('disCntBtn').onclick = connect;
  } 

    //updating data of ETH
     if(localStorage.getItem('redirected') === 'true'){
      await getMew_ID();
      await getData();
      await UpdateBalance();
      setInterval(async function(){
        await getData();
         await UpdateBalance(); 
      },60000);
      
     }
    
    //Redirect to connect page on disconnecting the wallet
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
           localStorage.removeItem("redirected");
           window.location.href = "/";
        }
    })
    
    // Copy to clipboard
    document.getElementById('CopyButton').onclick = function () {
	    var text = document.getElementById('myaddress');
	    navigator.clipboard.writeText(text.value).then(function () {
	    let button = document.getElementById('CopyButton')
	    button.classList.add('cpybtn');
	    button.innerHTML = "copied!";
	    setTimeout(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 1000);
	  document.getElementById('CBR').click();
	})}

  //view Transactions
  document.getElementById('view').onclick = viewTransaction;

  //Transaction alert
  document.getElementById('SendBtn').onclick = async function(){
    document.getElementById('CBS').click();
    // setTimeout(function(){alert('Transaction intiated ! \n Click "OK" and wait for confirmation.')},500);
    setInterval( async function(){
     await TxnUpdate();
    },20000);
  };

  };

  
  
  