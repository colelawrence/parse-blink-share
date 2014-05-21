document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active:true}, function (tabs) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (state) {
        if (xhr.readyState === 4) {
          document.getElementById("link").innerText = "http://ink.parseapp.com/k/" + JSON.parse(xhr.responseText).id
        }
      }
    xhr.open("GET", 'http://ink.parseapp.com/k?destination=' + escape(tabs[0].url), true);
    console.log(tabs)
    xhr.send(null);
  })
});