import json
import base64
import random
from urllib import parse as urlparse

## in this gifs dict
## the "key" is the argument that the user will pass in Slack... "/mycommand name1"
## the "value" is the gif url

gifs = {
  'name1': 'gif_url1',
  'name2': 'gif_url2'
}

def gif_selector(text, gifs):
    if text in gifs:
        return gifs[text]
    else:
        return gifs[random.choice(list(gifs.keys()))]
    

def lambda_handler(event, context):
    global gifs
    
    # parse the event
    msg_map = dict(urlparse.parse_qsl(base64.b64decode(str(event['body'])).decode('ascii')))
    text = msg_map.get('text')
    path = gif_selector(text, gifs)
    
    # return the right gif
    # if the user passes "help", tell them all the options
    # otherwise send the gif
    
    if text == 'help':
        return  {
                'response_type': 'in_channel',
                'attachments': [
                    {
                        'text': 'Options are: ' + ', '.join(list(gifs.keys()))
                    }
                ]
            }
    else:
        return  {
                'response_type': 'in_channel',
                'attachments': [
                    {
                        'image_url': path
                    }
                ]
            }