'use strict';

const keys = require('../config/keys');
const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);

const witToken = keys.witToken;
const witClient = require('../server/witClient')(witToken);

const slackToken = keys.slackToken;
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);
rtm.start();

const PORT = process.env.PORT || 5000;

slackClient.addAuthenticatedHandler(rtm, () => server.listen(PORT));

server.on('listening', function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});