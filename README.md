# pi_slash_commands
Tutorial for setting up slash commands to be hosted on a headless raspberry pi 3b+. My specific use-case was to link a command like `/gotem` to a specific gif posted in the channel.

I am certain there are better ways to do this. But I hope this helps you get started.

# resources
The bones of this overlaps with what you can follow here: 
`https://api.slack.com/tutorials/tunneling-with-ngrok`

I've modified some pieces to work specifically with the Pi use-case.

# dependencies
-ngrok
-screen
-node.js

# process
## download and extract ngrok
We're going to do all of our installs in $PATH directory to enable it to run from anywhere. So, find your systems $PATH directory with this:
`echo $PATH`

Typically this will yield `/usr/local/bin`. Change to this directory with `cd` and download the ngrok client for Linux ARM. 

You can either download locally and use `scp` to copy the binary to your pi, or `ssh` into your pi and download the binary directly using something like this (which worked as of 4/2/20):

```
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-arm.zip
unzip ngrok*
```

## install node.js if you don't already have it
Similarly to before, we need to download the linux ARM binary. Find the appropriate tar.gz file and download with `wget` like the below. This will also move you out of your binary dir (line 1) and extract the archive (line 3).

```
cd ..
wget https://nodejs.org/dist/v8.9.0/node-v8.9.0-linux-armv6l.tar.gz
tar -xzf node-v8.9.0-linux-armv6l.tar.gz
```
Test the install by running `node -v` and `npm -v`.

Our script will eventually need two modules that may or may not come with the base install (I don't know anything about node, but I vaguely remember having to install these). Run this:
`npm install express request` 

## set up your screen
If you don't have it already, download screen with this:
`sudo apt-get install screen`

This allows us to disconnect and reconnect from our processes without killing them. We can even disconnect from the SSH session, which is perfect for using the pi as a remote server to process our slash commands.

-To open a screen, use the command `screen`. 
-To detach from session, use `CTRL + A and then D`
-To list your available screens, use `screen -ls`
-To reconnect to a specific screen, use `screen -r screenID`

These are basically the only screen commands I know and should be more than enough for now.

## launch into your screen and tunnel your server
Run `screen`

Pick a four digit port number and run this:
`ngrok http 8888` 

You should see something like this (from the Slack tutorial):
![alt text](https://a.slack-edge.com/80588/img/api/articles/ngrok-running.png "Slack reference")

Make note of the forwarding URL. In the example photo it was `http://018bad74.ngrok.io`. Slack will need this later when we set up our slash command.

Detach from your screen with `CTRL + A D`

*A quick but very important note on this. If you're process dies (and it probably will at some point!), when you relaunch this command you will get a different forwarding URL and you will have to update your slash commands accordingly.*

## set up the http server to process incoming http requests
Let's return to the home directory with `cd ~/.` and create an empty folder called `slackapp`. Create an `index.js` file inside this folder. I've included a reference file (copied and modified from the Slack tutorial) in this repo called `index.js`.

Launch another screen and run the following command from the slackapp directory: `sudo node index.js`

Detach from the screen and create the slack app! We'll come back and refactor the `index.js` once the app is created.

## creating a private slack app
With the setup we've done so far, we can now follow very closely with the Slack instructions (Reminder, they did all the hard work and their docs live here: https://api.slack.com/tutorials/tunneling-with-ngrok)

-Go to `https://api.slack.com/apps`
-Click `Create new App`
-In the redirect URI field, paste your ngrok forwarding address and add the /oauth endpoint at the end of the address. Example: `http://018bad74.ngrok.io/oauth`
-Click `Create App`
-Click `Slash Commands` on the left menu and then `Create New Command`
--Use the same forwarding address from before
--The `Command` is what the app will listen for in slack
--The at the end of the forwarding address in the `Request URL` add whatever string you have in your `index.js`. Using the example provided this might be `http://018bad74.ngrok.io/command_gotem`
(From `app.post('/command_gotem', ...`)
-Click `Basic Info` in the left menu and get your client ID and client secret. Add those to `index.js`

## authenticating and getting it all running
Reconnect to the screen where you set up the http server and kill the process with `CTRL+c`. Kick it off again with `sudo node index.js` and all the changes you made in the previous step will take effect.

To authenticate, go to `https://api.slack.com/docs/slack-button`  and find the `Add to Slack button HTML` section. Select your app, check the `commands scope` box, and click `Add to Slack`

Your slash command should now work!