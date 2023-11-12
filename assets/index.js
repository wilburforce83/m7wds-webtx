

// TODO: This needs work. Submit button currently does not do anything.
// Also, page does not get reloaded and therefore the results are not shown.
// The POST request has to be done without AJAX.

function startRecording() {
  audioDownload.style.display = "none";
  startRecord.disabled = true;
  stopRecord.disabled = false;
  audio = [];
  recordedAudio.controls = false;
  rec.start();
}

function stopRecording() {
  startRecord.disabled = false;
  stopRecord.disabled = true;
  rec.stop();
}

//
async function postAudioBlobToServer(audioBlob) {
  // Create a new FormData object.
  const formData = new FormData();

  // Append the audio blob to the form data object.
  formData.append('file', audioBlob);

  // Send a POST request to the server's `/upload` endpoint with the form data object as the body.
  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });

  // Check if the response was successful.
  if (response.ok) {
    // The file was uploaded successfully.
    return response;
  } else {
    // There was an error uploading the file.
    throw new Error('Failed to upload file.');
  }
}


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

