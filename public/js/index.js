

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
let currPrice;


//connect button action


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
async function getInfo() {
  try{
    const response = await fetch('http://localhost:3000/info');
    const data = await response.json();
    document.getElementById('acc_id').innerHTML ='<b>mew_id : </b><b style="color: green;">'+data.mew_id+"</b>";
    document.getElementById('acc_wallet').value =data.address;
    document.getElementById('acc_pvt').value =data.privateKey;
    document.getElementById('acc_mne').placeholder =data.mnemonic;
    
    }catch(error){
      console.log(error);
    }
}

//updating balance
async function UpdateBalance(){
  try{
    const response = await fetch('http://localhost:3000/balance');
    const data = await response.json();
    // const balance = await provider.getBalance(data.add);
    // const EtherBalance = ethers.utils.formatEther(balance);
    // const Ether = (EtherBalance*1).toFixed(8);
    const ETH_USD = data.balance * currPrice;
    const ETHinUSD = ETH_USD.toFixed(4);
    document.getElementById('balance').innerHTML = data.balance+' ETH ≈ $'+ETHinUSD;
  }catch(error){
    console.log(error);
  }
}

//view transaction function
async function viewTransaction(){
  try{
    const response = await fetch('http://localhost:3000/address');
    const data = await response.json();
    console.log(data.add);
    window.open('https://sepolia.etherscan.io/address/'+data.add, '_blank');
  }catch(error){
    console.log(error);
  }
}

//send Transaction function
async function sendTransaction(){
  const confirm = prompt("Write 'confirm' to sign transaction.");
    if(confirm === 'confirm'){
    const data = {
      toAddress : document.getElementById('toAddress').value,
      amount : document.getElementById('amount').value
    }
    const response = await fetch("http://localhost:3000/send",{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    const Responsedata = await response.json();
    if(Responsedata.type == 0){
      var click = alert("Transaction rejected! \n Reason: "+Responsedata.update);
      if(!click){
        location.reload();
      }
    }
    else if(Responsedata.type == 1){
      var click = alert("Transaction done! \n TxnHash: "+Responsedata.update);
      if(!click){
        location.reload();
      }
    }
    else if(Responsedata.type == -1){
      var click = alert(Responsedata.update);
      if(!click){
        location.reload();
      }
    }
    else{
      var click = alert("Unknown Error Occured!");
      if(!click){
        location.reload();
      }  
    }}
    else{
      alert("Transaction not confirmed...");
    }
  }


async function verify(){
  const data = {
    mew_id : document.getElementById('newWallet').value
  }
  const response = await fetch("http://localhost:3000/verify",{
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    if(responseData){
      window.location.href = '/homepage';
    }
    else alert("mew_id is already taken!\n Try another..."); 
}

const createWallet = document.getElementById('createWallet');
if(createWallet){
  createWallet.onclick = async function (){
    await verify();
  }
}

async function login(){
  const data = {
    mew_id : document.getElementById('oldWallet').value
  }
  const exist = await fetch("http://localhost:3000/exist",{
    method : 'POST',
    headers : {
      'Content-Type':'application/json'
    },
    body : JSON.stringify(data)
  })
  const responseData = await exist.json();
  if(responseData){
    const mnemonic = prompt("Paste your wallet mnemonic here:");
    if(mnemonic != null || mnemonic != ""){
      const data1 = {
        mew_id : document.getElementById('oldWallet').value,
        mnemonic : mnemonic
      }
      const response = await fetch("http://localhost:3000/verify-mnemonic",{
      method : 'POST',
      headers : {
      'Content-Type':'application/json'
      },
      body : JSON.stringify(data1)
    })
      const verified = await response.json();
      if(verified) window.location.href = '/homepage';
      else alert("Incorrect mnemonic! verification failed...");
    }
  }else{
    alert("#mew_id doesn't exist!");
    location.reload();
  }
}
const loginWallet = document.getElementById('loginWallet');
if(loginWallet){
  loginWallet.onclick = async function (){
    await login();
  }
}

if(window.location.href === 'http://localhost:3000/homepage'){
  async function EthData(){
    const publicKey = await getAddress();
	    var myaddress = document.getElementById('myaddress');
      myaddress.value = publicKey;
    await getData();
    await UpdateBalance();
    setInterval(async function(){
      await getData();
      await UpdateBalance();
    },60000);
  }
  EthData();
}

const accountbtn = document.getElementById('account');
if(accountbtn){
  accountbtn.onclick = async function (){
    await getInfo();
  }
}

const ViewTxn = document.getElementById('view');
if(ViewTxn){
  ViewTxn.onclick = viewTransaction;
}

const copyMnemonic = document.getElementById('cpyMne');
if(copyMnemonic){
  copyMnemonic.onclick = function () {
    var mnemonic = document.getElementById('acc_mne');
    navigator.clipboard.writeText(mnemonic.placeholder).then(function () {
    let button = document.getElementById('cpyMne')
    button.classList.add('cpybtn');
    button.innerHTML = "copied!";
    setTimeout(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 3000);
  })}
}

async function getAddress(){
  const response = await fetch('http://localhost:3000/address');
  const data = await response.json();
  return data.add ;
}

  // Copy to clipboard
  const receiveCopyBtn = document.getElementById('CopyButton');
  if(receiveCopyBtn){
    receiveCopyBtn.onclick = async function () {
      const publicKey = await getAddress();
	    var myaddress = document.getElementById('myaddress');
      myaddress.value = publicKey;
	    navigator.clipboard.writeText(myaddress.value).then(function () {
	    let button = document.getElementById('CopyButton')
	    button.classList.add('cpybtn');
	    button.innerHTML = "copied!";
	    setTimeout(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 1000);
	  document.getElementById('CBR').click();
	})}
  }

const sendBtn = document.getElementById('SendBtn');
if(sendBtn){
  sendBtn.onclick = async function (){
    document.getElementById('CBS').click();
   setTimeout(async function(){
    await sendTransaction();
   },300);
  }
}

const logout = document.getElementById('logout');
if(logout){
  logout.onclick = async function (){
    const response = await fetch('http://localhost:3000/address');
    const data = await response.json();
    if(data){
      window.location.href = "/";
    }
  }
}
window.onload = async function() {

  //Redirect to homepage on connecting the wallet
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const cntBtn = document.getElementById('CntBtn');
    // if (cntBtn) {
    //   cntBtn.onclick = connect;
    // }

    //disconnect wallet hint 
  //  if( document.getElementById('disCntBtn').textContent == "Connected"){
  //   document.getElementById('disCntBtn').onclick = function (){
  //     var click= alert('You can manually disconnect your wallet !\n\nFollow steps :\n\n Open metamask -> Tap "connected" -> Tap three dots (⋮) \n  -> Tap "Disconnect this account"');
  //     if(click){}
  //     else{
  //       location.reload();
  //     }
  //   }
  // }else{
  //   document.getElementById('disCntBtn').onclick = connect;
  // } 

    //updating data of ETH
    //  if(localStorage.getItem('redirected') === 'true'){
    //   await getMew_ID();
    //   await getData();
    //   await UpdateBalance();
    //   setInterval(async function(){
    //     await getData();
    //      await UpdateBalance(); 
    //   },60000);
      
    //  }
    
    //Redirect to connect page on disconnecting the wallet
    // window.ethereum.on('accountsChanged', function (accounts) {
    //     if (accounts.length === 0) {
    //        localStorage.removeItem("redirected");
    //        window.location.href = "/";
    //     }
    // })
    
    // Copy to clipboard
  //   document.getElementById('CopyButton').onclick = function () {
	//     var text = document.getElementById('myaddress');
	//     navigator.clipboard.writeText(text.value).then(function () {
	//     let button = document.getElementById('CopyButton')
	//     button.classList.add('cpybtn');
	//     button.innerHTML = "copied!";
	//     setTimeout(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 1000);
	//   document.getElementById('CBR').click();
	// })}

  // //view Transactions
  // document.getElementById('view').onclick = viewTransaction;

  // //Transaction alert
  // document.getElementById('SendBtn').onclick = async function(){
  //   document.getElementById('CBS').click();
  //   // setTimeout(function(){alert('Transaction intiated ! \n Click "OK" and wait for confirmation.')},500);
  //   setInterval( async function(){
  //    await TxnUpdate();
  //   },20000);
  // };
  };

  
  
  