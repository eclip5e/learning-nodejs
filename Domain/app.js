'use strict';

var domain = require('domain');

var server;
var serverDomain = domain.create();

serverDomain.on('error', function (error) {
    console.error('Domain caught error: %s', error);
    if (server) server.close();

    setTimeout(function () {
        process.exit(1);
    }, 1000).unref();
});

serverDomain.run(function () {
    var http = require('http');
    var handler = require('./handler.js');

    server = http.createServer(function (request, response) {

        var reqDomain = domain.create();
        reqDomain.add(request);
        reqDomain.add(response);

        reqDomain.on('error', function (error) {
            response.statusCode = 500;
            response.end('Error:', error);

            serverDomain.emit('error', error);
        });

        reqDomain.run(function () {
            handler(request, response);
        });
    });

    server.listen(3000);
});