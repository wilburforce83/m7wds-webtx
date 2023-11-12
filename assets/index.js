

// TESTING SIMPLE COLLECTION
window.addEventListener('load', function() {
  console.log('All assets are loaded')
  var button = document.getElementById("ttssubmit");
button.addEventListener("click",function(e){
  document.getElementById('ttsform').submit();
  ttsMessageSubmit()
},false);
})


function ttsMessageSubmit() {
// (A) GET TEXT AREA DATA
document.querySelector('#ttssubmit').disabled = true;
 var txMes = tts.value;
  console.log(txMes);
  var date = new Date();
  let time = date.toLocaleTimeString("default");
  console.log(time);
  
  setTimeout(function () {
    document.querySelector('#ttssubmit').disabled = false;
    document.getElementById('notifyme').insertAdjacentHTML("afterbegin", '<p><tt>Tx Sent: '+time+' | ' + txMes + ' </tt></p>');
  },5000)
}


function TxToSite() {
console.log("button was clicked!")
const audioBlob = blobbySound;
postAudioBlobToServer(audioBlob);

};

