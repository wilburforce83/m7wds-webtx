
const bcrypt = require("bcryptjs"),
  path = require("path"),
  express = require("express"),
    bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  multer = require("multer"),
  jwt = require("jsonwebtoken"),
  TTS = require("./ttsTx-engine");
  var fs = require("fs");
var http = require("http");
// Require the upload middleware
const upload = require('./upload');



// (A2) EXPRESS + MIDDLEWARE
const app = express();
app.use(multer().array());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// (B) USER ACCOUNTS - AT LEAST ENCRYPT YOUR PASSWORDS!
//bcrypt.hash("yournewpasswordhere", 8, (err, hash) => { console.log(hash); }); //uncomment this and run your new password then delete the text for your password.
const users = {
  "web@tx.com": "$2a$08$i5lNfpmd0URaZl/T.xTyd.2TIpj5DSj0k2onlDdSfhHi02C4lIJSe"
};

// (C) JSON WEB TOKEN
// (C1) SETTINGS - CHANGE TO YOUR OWN!
const jwtKey = "YOUR-SECRET-KEY",
  jwtIss = "YOUR-NAME",
  jwtAud = "site.com",
  jwtAlgo = "HS512";

// (C2) GENERATE JWT TOKEN
jwtSign = (email) => {
  // RANDOM TOKEN ID
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&_-", rnd = "";
  for (let i = 0; i < 16; i++) {
    rnd += char.charAt(Math.floor(Math.random() * char.length));
  }

  // UNIX NOW
  let now = Math.floor(Date.now() / 1000);

  // SIGN TOKEN
  return jwt.sign({
    iat: now, // ISSUED AT - TIME WHEN TOKEN IS GENERATED
    nbf: now, // NOT BEFORE - WHEN THIS TOKEN IS CONSIDERED VALID
    exp: now + 3600, // EXPIRY - 1 HR (3600 SECS) FROM NOW IN THIS EXAMPLE
    jti: rnd,
    iss: jwtIss, // ISSUER
    aud: jwtAud, // AUDIENCE
    // WHATEVER ELSE YOU WANT TO PUT
    data: { email: email }
  }, jwtKey, { algorithm: jwtAlgo });
};

// (C3) VERIFY TOKEN
jwtVerify = (cookies) => {
  if (cookies.JWT === undefined) { return false; }
  try {
    let decoded = jwt.verify(cookies.JWT, jwtKey);
    // DO WHATEVER EXTRA CHECKS YOU WANT WITH DECODED TOKEN
    // console.log(decoded);
    return true;
  } catch (err) { return false; }
}

// (D) EXPRESS HTTP
// (D1) STATIC ASSETS
app.use("/assets", express.static(path.join(__dirname, "assets")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});

// (D3) APP PAGE - REGISTERED USERS ONLY
app.get("/tx", (req, res) => {
  if (jwtVerify(req.cookies)) {
    res.sendFile(path.join(__dirname, "/index.html"));
  } else {
    res.redirect("../login");
  }
});

// (D4) LOGIN PAGE
app.get("/login", (req, res) => {
  if (jwtVerify(req.cookies)) {
    res.redirect("../tx");
  } else {
    res.sendFile(path.join(__dirname, "/login.html"));
  }
});

// (D5) LOGIN ENDPOINT
app.post("/in", async (req, res) => {
  let pass = users[req.body.email] !== undefined;
  if (pass) {
    pass = await bcrypt.compare(req.body.password, users[req.body.email]);
  }
  if (pass) {
    res.cookie("JWT", jwtSign(req.body.email));
    res.status(200);
    res.send("OK");
  } else {
    res.status(200);
    res.send("Invalid user/password");
  }
});

// (D6) LOGOUT ENDPOINT
app.post("/out", (req, res) => {
  res.clearCookie();
  res.status(200);
  res.send("OK");
});

// (E) GO!
http
  .createServer(
    //{
      //key: fs.readFileSync("server.key"),
      //cert: fs.readFileSync("server.cert"),
    //},
    app
  )
  .listen(7878, function () {
    console.log(
      "Example app listening on port 7878! Go to https://localhost:7878/"
    );
  });


/*

**************************************
**************************************


TEXT AND AUDIO COLLECTION FUNCTIONS


**************************************
**************************************
*/

//TTS COLLECTION
app.post('/tx', function(req, res) {
  var tts = req.body.tts;
  res.send();
  console.log(tts);
  TTS.Txtts(tts,"tts")
})

//AUDIO COLLECTION
// Set up a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // Handle the uploaded file
  res.json({ message: 'File uploaded successfully!' });
});
