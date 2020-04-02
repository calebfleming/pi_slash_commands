// Import express and request modules
var express = require('express');
var request = require('request');

// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables.
var clientId = 'clientId';
var clientSecret = 'clientSecret';

// Instantiates Express and assigns our app variable to it
var app = express();

// Again, we define a port we want to listen to
const PORT=8888;

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});

// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...
        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

app.post('/command_gotem', function(req, res) {
let gotem_data = {
  response_type: 'in_channel',
  attachments:[
    {
      image_url: 'https://media.giphy.com/media/Ko7UAfIKrlTyw/giphy.gif'
    }
]};
res.json(gotem_data);
});

app.post('/command_doc', function(req, res) {
	let doc_data = {
		response_type: 'in_channel',
		attachments : [
			{
				image_url : 'https://media.giphy.com/media/4C68wmly8RyUg/giphy.gif'
			}
		]};
	res.json(doc_data);
});