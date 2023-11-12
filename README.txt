#Readme

## Webtx

> I realised that it is quite a cool accessability project for people with Mutism, or Dysarthria; allowing the ability to transmit vox on amatuer frequencies, while tinkering with the pi and NodeJS



Webtx is a google text-to-speech powered audio transmission engine for the raspberry pi. I initially designed it for my work to be able to send radio transmissions to our operations team on shift from my laptop at home when I was on call. However, I realised that it is quite a cool accessability project for people with Mutism, or Dysarthria; allowing the ability to transmit vox on amatuer frequencies, while tinkering with the pi and NodeJS.

## Prerequisites

 - Raspberry Pi (3/4) - You can probably use 2b, but NodeJS doesn't run on Zero.
 - A pi relay board [Like this one.](https://www.switchelectronics.co.uk/products/5v-4-channel-relay-board-module?currency=GBP&variant=45334691742005&utm_medium=cpc&utm_source=google&utm_campaign=Google%20Shopping&stkn=bbf1d20e1ed7&gclid=Cj0KCQiAjMKqBhCgARIsAPDgWlxZCyfvUjboA224OZgCN4SVX8NxH9qK1La0J3f979VugGr1Xq7DgA8aAkgqEALw_wcB)
 - A spare PTT fist mic that you don't mind destroying / oryou can make your own if you are electronically minded; though I won't be going into those details here.

## Installation

I am assuming that we are working with a fresh install of raspbian, if you need help with how to get to this stage and connect up to your pi through ssh, please following this great guide [here.](https://www.youtube.com/watch?v=BpJCAafw2qE&ab_channel=CrosstalkSolutions)

Then we'll just make sure we are all up to date:

```terminal
sudo apt-get update
```
Then;
```terminal
sudo apt-get upgrade
```
### Software that we'll need
Firstly we need to get all the software that we'll be using in our project.

**VLC**
```terminal
sudo apt install -y vlc
```
**NODE JS**
Now, the version of NodeJS that is default on Raspbian is out of date, so we are gong to need to install a newer version on node manually in order to get us going. This is pretty straight forward.
First, we need to install `curl` as we'll be using this to grab the node js package:
```terminal
sudo apt-get install -y curl
```
test we have it;
```terminal
curl --version
```
You should see something like this;
```terminal
curl 7.74.0 (aarch64-unknown-linux-gnu) libcurl/7.74.0 OpenSSL/1.1.1w zlib/1.2.11 brotli/1.0.9 libidn2/2.3.0 libpsl/0.21.0 (+libidn2/2.3.0) libssh2/1.9.0 nghttp2/1.43.0 librtmp/2.3
Release-Date: 2020-12-09
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets
```
Let's grab NodeJS 16!!
```
curl -sSL https://deb.nodesource.com/setup_16.x | sudo bash -
```
Then;
```terminal
sudo apt install -y nodejs
```
Let's now check that we have both Node and NPM installed;
```terminal
node -v
npm -v
```
It should say something like:
```terminal
v.16.20.2
8.19.4
```

**Google Cloud CLI**
We'll need this to authorise and use the google TTS engine. This can be a bit confusing if you've never done anything like this before. I would recommend following some tutorials to set up a google cloud account.

```terminal
sudo apt-get install apt-transport-https ca-certificates gnupg sudo
```
Add google CLI as a package source;
```terminal
echo "deb [signed-by=/usr/share/keyrings/cloud.google.asc] https://packages.cloud.google.com/apt cloud-sdk main"  | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
```
Then;
```terminal
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo tee /usr/share/keyrings/cloud.google.asc
```
Finally install google-cloud-cli;
```terminal
sudo apt-get update && sudo apt-get install google-cloud-cli
```
If you have problems here, it could be due to the version on raspbian you are running, I would recommend following this tutorial from Google [here.](https://cloud.google.com/sdk/docs/how-to)

### Installing Webtx
First we need to grab the repo and install it;
```terminal
git clone https://github.com/wilburforce83/m7wds-webtx.git
cd m7wds-webtx
npm install
```
If you have installed all the dependencies correctly, you should only receive a few warnings about, if you get any errors check the install feed in the terminal to see where it has failed.

### Linking Gcloud to your account
Navigate to the root folder of webtx and run the following command;
```terminal
gcloud init
```
It will respond with this;
```terminal
wilbur@webtxdev:~/m7wds-webtx $ gcloud init
Welcome! This command will take you through the configuration of gcloud.

Your current configuration has been set to: [default]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic detects and fixes local network connection issues.
Checking network connection...done.                                                                                                                                                          
Reachability Check passed.
Network diagnostic passed (1/1 checks passed).

You must log in to continue. Would you like to log in (Y/n)?  
```

Type `Y` and hit enter;
This will bring up a link that you must follow to get an authorisation code, follow the link and the instructions then paste the code back into the terminal.
Once entered you will recieve an authorisation confirmation, then you will need to select which cloud project to link to.

### Configuring Webtx

If you are using webtx on your local network you don't really need to do anything, you can use the default login details:
```
U: web@tx.com
P: webtx
```
You can change the username within and password within `server.js`. To generate a new hashed password run ghte following function on `Ln 24`:
```javascript
bcrypt.hash("yournewpasswordhere", 8, (err, hash) => { console.log(hash); });
```
This will print your hashed password in the terminal. Be sure to remove your unencrypted password from the function and comment it out once you have it copied.
Paste the password into line 26:
```javascript
const  users  = {
"user@email.com":  "hashedpassword"
};
```
## Starting Webtx

Run;
```terminal
npm start
```
Then navigate to `localhost:7878` or the IP address i.e. `192.168.1.182:7878` if you are running a headless raspberry pi.

## Connecting up the hardware
This is going to be different for everybody, but it is rather simple. Basically the headphone jack on the raspberry pi will connect up to the microphone wiring of a fist mic, and the relay will connect up to the PTT button.

Webtx is designed to trigger the relay to open the vox line, then to play the audio through the headphone jack.
