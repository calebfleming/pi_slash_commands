// Import express and request modules
var express = require('express');
var request = require('axios');
var bodyParser = require('body-parser');

// Store our app's ID and Secret. These we got from Step 1.
var clientId = 'clientId';
var clientSecret = 'clientSecret';

const gifConfig = {
  gotem: 'https://media.giphy.com/media/Ko7UAfIKrlTyw/giphy.gif',
  doc: 'https://media.giphy.com/media/4C68wmly8RyUg/giphy.gif',
  getsome: 'https://media.giphy.com/media/ghpdI3dNfX0pW/giphy.gif',
  yeahyep: 'https://media.giphy.com/media/3oFzm7MaLnMdD1T6tG/giphy.gif',
  interesting: 'https://media.giphy.com/media/VFYJXIuuFl6pO/giphy.gif',
  lolz: 'https://media.giphy.com/media/VIVWFx6c91AAwWLwWB/giphy.gif',
  nope: 'https://media.giphy.com/media/fDO2Nk0ImzvvW/giphy.gif',
  undertaker: 'https://media.giphy.com/media/b6iVj3IM54Abm/giphy.gif',
  why: 'https://media.giphy.com/media/3o7btYetccbRYL4WVW/giphy.gif',
  smiling: 'https://media.giphy.com/media/xghFgmOKbk0G4/giphy.gif'
};

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT=6969;

app.listen(PORT, function () {
    console.log("Example app listening on port " + PORT);
});

// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET',
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

app.post('/barnwood', function(req, res) {
  console.log(req)
  const requestParam = req.body.text || 'invalid';

  const getRandom = () => {
  const properties = Object.getOwnPropertyNames(gifConfig);
  const index = Math.floor(Math.random() * properties.length);
  return gifConfig[properties[index]];
  }

  const response = {
    response_type: 'in_channel',
    attachments: [
      {
	      image_url : gifConfig[requestParam]  ? gifConfig[requestParam] : getRandom()
      }
    ]
  };

  res.json(response);
});
