'use strict';

const request = require('superagent');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
server.listen();

server.on('listening', function() {
    console.log(`IRIS-TIME is listening on ${server.address().port} in ${service.get('env')} mode.`);

    const announce = () => {
        request.put(`http://localhost:3000/service/time/${server.address().port}`, (err, res) => {
            console.log(err);
            if(err) console.log("Error connecting to Iris");
        });
    };
    announce();
    setInterval(announce, 15*1000);
});