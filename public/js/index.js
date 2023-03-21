

window.onload = function() {
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

    //Redirect to connect page on disconnecting the wallet
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            window.location.href = "/";
        }
    })
      
      
  };
  