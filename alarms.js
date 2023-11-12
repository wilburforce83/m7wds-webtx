const RPiGPIOButtons = require('rpi-gpio-buttons');
const PLC15 = 17;
const PLC16 = 18;
const PLC17 = 27;
const PLC18 = 22;
const PLC21 = 23;
const PLC22 = 24;
const PLC23 = 25;
const TTS = require("./ttsTx-engine");
const email = require("./email_engine");
let buttons = new RPiGPIOButtons({ pins: [PLC15, PLC16, PLC17, PLC18, PLC21, PLC22, PLC23], usePullUp: false });




buttons
  .on('error', error => {
    console.log('ERROR', error);
  })
  .on('debug', debug => {
    console.log('DEBUG', debug);
  })
  .on('pressed', function (pin) {
    switch (pin) {
      case PLC15:
        let details1 = {
          "message": "The macerator has tripped, please investigate.",
          "source": "./audio_files/macerator.wav"
        }
        trigger(details1);
        break;
      case PLC16:
        let details2 = {
          "message": "The decanter has tripped, please investigate.",
          "source": "./audio_files/decanter.wav"
        }
        trigger(details2);
        break;
      case PLC17:
        let details3 = {
          "message": "The BUP has tripped, please investigate.",
          "source": "./audio_files/bup.wav"
        }
        trigger(details3);
        break;
      case PLC18:
        let details4 = {
          "message": "The ROV has closed, please investigate.",
          "source": "./audio_files/rov.wav"
        }
        trigger(details4);
        break;
      case PLC21:
        let details5 = {
          "message": "Gas to Grid is rejecting, please investigate.",
          "source": "./audio_files/rejecting.wav"
        }
        trigger(details5);
        break;
      case PLC22:
        let details6 = {
          "message": "The digester has a high pressure alarm, please investigate.",
          "source": "./audio_files/dig-high.wav"
        }
        trigger(details6);
        break;
      case PLC23:
        let details7 = {
          "message": "The digester has a low pressure alarm, please investigate.",
          "source": "./audio_files/dig-low.wav"
        }
        trigger(details7);
        break;
    }
  })
  .on('button_event', (type, pin) => {
    console.log(`button_event ${type} on ${pin}`)
  });



// Alarm functions


function trigger(details) {
  let message = details.message
  console.log(details.message);
  TTS.alarmTx(details.source);
  email.send(message);
}



buttons.init()

