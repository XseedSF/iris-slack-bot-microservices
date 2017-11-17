'use strict';

const request = require('superagent');
const service = require('../server/service');
const http = require('http');
const keys = require('../config/keys');

const server = http.createServer(service);
server.listen();

server.on('listening', function() {
    console.log(`IRIS-TIME is listening on ${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        request.put(`${keys.MAIN_APP_URL}/service/time/${server.address().port}`, (err, res) => {
            if(err) {
                console.log(err);
                console.log("Error connecting to Iris"); 
            }
        });
    };
    announce();
    setInterval(announce, 15*1000);
});