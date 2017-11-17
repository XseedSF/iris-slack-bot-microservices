'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
    
    if (message.text && message.text.toLowerCase().includes('iris')) {
        nlp.ask(message.text, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }

            try {
                if(!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract intent.");
                }

                const intent = require('./intents/' + res.intent[0].value + 'Intent');

                intent.process(res, registry, function(error, response) {
                    if(error) {
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                });
            } catch(err) {
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel);
            }

        });
    }
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(bot_token, logLevel = 'debug', nlpClient, serviceRegistry) {
    rtm = new RtmClient(bot_token, { logLevel: logLevel });
    nlp = nlpClient;
    registry = serviceRegistry;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;


// var RtmClient = require('@slack/client').RtmClient;
// var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

// var bot_token = process.env.SLACK_BOT_TOKEN || '';

// var rtm = new RtmClient(bot_token, {logLevel: 'debug'});

// let channel;

// // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
// rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
//   for (const c of rtmStartData.channels) {
// 	  if (c.is_member && c.name ==='general') { channel = c.id }
//   }
//   console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
// });

// // you need to wait for the client to fully connect before you can send messages
// rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
//   rtm.sendMessage("Hello!", channel);
// });

// rtm.start();