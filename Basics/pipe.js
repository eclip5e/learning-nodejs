'use strict';

var http = require('http');
var fs = require('fs');

new http.Server(function (request, response) {

    if (request.url === '/big.html') {
        var file = new fs.ReadStream('big.txt');
        sendFile(file, response);
    }

}).listen(3000);

function sendFile(file, response) {

    file.pipe(response);

    file.on('error', function (error) {
        response.statusCode = 500;
        response.end('Server Error');
        console.log(error);
    });

    file.on('open', function () {
        console.log('OPEN');
    }).on('close', function () {
        console.log('CLOSE');
    });

    response.on('close', function () {
        file.destroy();
    });

}