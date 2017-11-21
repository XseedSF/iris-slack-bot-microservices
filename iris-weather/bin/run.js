'use strict';
const request = require('superagent');
const service = require('../server/service');
const http = require('http');
const keys = require('../config/keys');

const server = http.createServer(service);
server.listen(process.env.PORT || 3010);

server.on('listening', function() {
    console.log(`IRIS-Weather is listening on ${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        console.log("Main app url is:", keys.MAIN_APP_URL);
        request.put(`${keys.MAIN_APP_URL}/service/weather/${server.address().port}`, (err, res) => {
            if(err) {
                console.log(err);
                console.log("Error connecting to Iris"); 
            }
        });
    };
    announce();
    setInterval(announce, 15*1000);
});