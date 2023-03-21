
//const {ethers} = require('ethers');
//import { ethers } from "ethers";

// const { ethers } = require("ethers");

// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const app = express();
// const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/3257f723cdc840198733d629c17c7cd2");
const provider = new ethers.providers.Web3Provider(window.ethereum);
const ContractAddress ="0x82cB090B231C55aF7b4fc462AED822eDA3267996";
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Received",
		"type": "event"
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
		"name": "Withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
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
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

const contract = new ethers.Contract(ContractAddress,abi,provider);
let amount,from,flag;

// Copy to clipboard
document.getElementById('CopyButton').onclick = function () {
	var text = document.getElementById('myaddress');
	navigator.clipboard.writeText(text.value).then(function () {
	  let button = document.getElementById('CopyButton')
	  button.classList.add('cpybtn');
	  button.innerHTML = "copied!";
	  setTimeout(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 1000);
	  document.getElementById('CBR').click();

	})
  }

// Update Balance function
const UpdateBalance = async() =>{
     var bal = ethers.utils.formatEther(await contract.GetBalance());
    document.getElementById('balance').innerHTML = (bal + " ETH");
    document.getElementById('myaddress').value = ContractAddress ;
}
UpdateBalance();

// On send transaction and balance update
document.getElementById('SendBtn').onclick = async function(){
	var sendAdd = document.getElementById('inputAddress').value ;
	var  Amt = document.getElementById('amount').value;
	  await provider.send("eth_requestAccounts",[]);
	  const signer = provider.getSigner();
	  const SignContract = new ethers.Contract(ContractAddress,abi,signer);
	  const txnResponse = await SignContract.Send(ethers.utils.parseEther(Amt),sendAdd);
	  document.getElementById('CBS').click();
	  setTimeout(function() {alert("Transaction initiated !")},1500);
	  const txnHash = txnResponse.hash;
	  await provider.waitForTransaction(txnHash);
	  flag = 1; amount = Amt ; from = sendAdd;
	  UpdateBalance();
	  UpdateLastTansaction(from,amount,flag);
}

// On receive balance update
contract.on('Received', (fromContract, amtContract, event) => {
  UpdateBalance();
  flag = 0; amount = ethers.utils.formatEther(amtContract); from = fromContract; 
  UpdateLastTansaction(from,amount,flag);
})

// update last transaction
function UpdateLastTansaction(from ,amount,flag){
	localStorage.setItem('updateFrom',from);
	if(localStorage.getItem('updateFrom')){
		 document.getElementById('LastTxnAdd').innerHTML = localStorage.getItem('updateFrom');
	}
	if(flag == 1){

		localStorage.setItem('updateAmt',"-"+amount+" ETH");
		if(localStorage.getItem('updateAmt')){
		 document.getElementById('LastTxnBal').innerHTML = localStorage.getItem('updateAmt');
		}
	}
	else{
		localStorage.setItem('updateAmt',"+"+amount+" ETH");
		if(localStorage.getItem('updateAmt')){
		 document.getElementById('LastTxnBal').innerHTML = localStorage.getItem('updateAmt');
		}
	}
}
UpdateLastTansaction();
async function Text(){
  console.log(ethers.utils.formatEther(await contract.GetBalance()));
}
Text();
