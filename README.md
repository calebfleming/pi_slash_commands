# Notes
This repo was originally made to explain how to set up Slack slash commands to be hosted on a headless raspberry pi 3b+. My specific use-case was to link a command like `/gotem` to a specific gif posted in the channel.

For this relatively older use-case, reference the `pi-hosted-readme.md` instructions. I stopped using and maintaining this implentation because whenever I lost power or internet, I had to jump through too many hoops to relaunch my script (including getting a new forwarding URL from ngrok that had to be updated in Slack for each gif)

Instead, I now run this with free credits on AWS with Lambda and API Gateway. It is so much easier and more reliable. 

Some day I hope to add details in a new README, but for now I will just share the lambda function in the hopes that you can figure the rest out on your own. Find that Python code available in `slash_handler.py`. There is a lot of implementation overlap on the Slack side, so referencing the aforementioned ngrok instructions might be helpful still.