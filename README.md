# iris-slack-bot-microservices
Sample Node Bot for Slack, that tells you the weather and time of a given City

It has two microservices [iris-time, iris-weather] that connect to different APIs to get the info. 
They report themselves to the main Iris app in order it registers them as Services available.

The main Iris app listens to Slack messages, when it is mentioned it send the message to be processed by Wit.ai
Depending of the intents that wit finds, it send the message to the corresponding Service Registeres for that intent, and then returns the message to Slack as a reply.

This is based form the result of a Course by Daniel Khan.
