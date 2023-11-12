// Text to speech engine

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const player = require('node-wav-player');
// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// REQUIRE PI RELAY BOARD
const SeeedStudioRelayBoard = require('js-seeed-studio-relay-board');

module.exports = {
    Txtts: function (TextToSpeak) {
    G_speak(TextToSpeak);
    },
    alarmTx: function (audioFileLocation) {
      sendCustomTransmission(audioFileLocation);
    }
};


// Google function
async function G_speak(textToSpeak) {
    // The text to synthesize
    const text = textToSpeak;
  
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'en-GB', ssmlGender: 'FEMALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'LINEAR16'},
    };
  
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.wav', response.audioContent, 'binary');
    console.log('Audio content written to file: output.wav');
    sendCustomTransmission("output.wav");
  };



// PTT custom transmission from TTS engine "Play mp3 and transmit"
async function sendCustomTransmission(TextToSpeak) {
    const rpi = new SeeedStudioRelayBoard.Relay();

    // Initialize I2C controler
    await rpi.init();

    // Trigger PTT on Relay 1
    await rpi.on(1);

    // Small Delay to allow for latency on PTT
    var TxDelay = 1000; //1.2 second

    setTimeout(function () {
        // Tx typed message
        player.play({
          path: 'chime.wav',
          sync: true
        }).then(() => {
          player.play({
            path: TextToSpeak,
            sync: true
          }).then(() => {
            console.log('The wav file started to be played successfully.');
            let notification = "Tx sent: "+TextToSpeak;
            console.log(notification)
            // Switch off PTT relay
            rpi.off(1);
          }).catch((error) => {
            console.error(error);
            console.log('The wav file failed to play.');
            let notification = "Tx NOT sent: "+TextToSpeak;
            console.log(notification)
          });
        }).catch((error) => {
          console.error(error);
        });
        
           
        }), TxDelay;

};        