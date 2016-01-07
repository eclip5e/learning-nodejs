'use strict';

var http = require('http');
var fs = require('fs');
var chat = require('./chat.js');

function sendFile(file, response) {

    file.pipe(response);

    file.on('error', function (error) {
        response.statusCode = 500;
        response.end('Server Error');
        console.log(error);
    });

    response.on('close', function () {
        file.destroy();
    });

}

http.createServer(function (request, response) {

    switch (request.url) {
        case '/':
            var file = new fs.ReadStream('index.html');
            sendFile(file, response);
            break;
        case '/subscribe':
            chat.subscribe(request, response);
            break;
        case '/publish':
            var body = '';

            request.on('readable', function () {
                body += request.read();

                if (body.length > 1e4) {
                    response.statusCode = 413;
                    response.end('Message is too big.');
                }
            }).on('end', function () {

                try {
                    body = JSON.parse(body);
                } catch (error) {
                    response.statusCode = 400;
                    response.end('Bad Request.');
                    return;
                }

                chat.publish(body.message);
                response.end('OK');
            });

            break;
        default:
            response.statusCode = 404;
            response.end('404: Not Found.');
    }

}).listen(3000);