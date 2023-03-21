
//for copy button
document.getElementById('CopyButton').onclick = function () {
  var text = document.getElementById('myaddress');
  navigator.clipboard.writeText(text.value).then(function () {
    let button = document.getElementById('CopyButton')
    button.classList.add('cpybtn');
    button.innerHTML = "copied!";
    setInterval(function () { button.classList.remove('cpybtn'); button.innerHTML = "copy"; }, 5000);
  })
}


