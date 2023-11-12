
const nodemailer = require('nodemailer');
const fs = require('fs');
const GlobalData = fs.readFileSync('./globals.json');
const Globals = JSON.parse(GlobalData);

const transporter = nodemailer.createTransport({
    host: Globals.ServerName,
    port: Globals.Port,
    secure: false, // STARTTLS
    auth: {
      user: Globals.email,
      pass: Globals.password,
    },
  });

 console.log(Globals);
  
  

module.exports = {
    send: function (message) {

        let mail = {
            from: Globals.email,
            to: Globals.email,
            subject: 'SCADA ALERT - KENT',
            html: message,
          };

        transporter.sendMail(mail, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent successfully!');
            }
          });
    }
    
};