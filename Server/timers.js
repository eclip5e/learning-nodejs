'use strict';

var http = require('http');

var server = new http.Server(function (request, response) {

    process.nextTick(function () {
        request.on('readable', function () {
            // Processing...
        });
    });

}).listen(3000);

setTimeout(function () {
    server.close();
}, 2500);

var timer = setInterval(function () {
    console.log(process.memoryUsage());
}, 1000);

timer.unref();