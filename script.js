
var contract;
var address = "0x95643B6761397de5882A58210B5787Bb9CC90a75";
var abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "Amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "sendTo",
        "type": "address"
      }
    ],
    "name": "Send",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "Withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "GetBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

var web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/3257f723cdc840198733d629c17c7cd2'));
 var contract = new web3.eth.Contract(abi, address);

contract.methods.owner().call().then(function(add){
document.getElementById('myaddress').value = add ;
})

document.getElementById('SendBtn').onclick = sendTransact;
function sendTransact (){
  var sendAdd = document.getElementById('inputAddress').value ;
   Amt = document.getElementById('amount').value;
  var sendAmt = web3.utils.toWei(Amt, 'ether');
 // contract.methods.Send(sendAmt,sendAdd).send({from:"0x4A0B6552F1D6fD37abE1d3882e58bdEa522f2942"});
 //methods.solidityFunction(parameter...,{from: web3.eth.accounts[0], gas:1000000, value: web3.toWei(0.01, "ether")});
  contract.methods.Send(sendAmt,sendAdd).send({from: "0x4A0B6552F1D6fD37abE1d3882e58bdEa522f2942"}).then( alert("Transaction Initiated !"))
  // contract.methods.Send().call().then(
  //   alert("Transaction Initiated !"))
  //alert(sendAdd +" "+sendAmt);
}

//Withdraw
document.getElementById('withdrawBtn').onclick = function(){
 // contract.methods.Withdraw().send({from : "0x4A0B6552F1D6fD37abE1d3882e58bdEa522f2942"});
  //contract.methods.Withdraw().call().then(
   // alert("Withdraw procced !")
 // )
}

contract.methods.GetBalance().call().then(function (Balance) {
  //alert(Balance);
  var bal = Balance/1e18 ;
  document.getElementById('balance').innerHTML = (bal + " ETH");
})

