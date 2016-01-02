'use strict';

var http = require('http');
var url = require('url');

new http.Server(function (request, response) {

    console.log(request.headers);
    console.log(' METHOD: %s\n URL: %s', request.method, request.url);

    var urlParsed = url.parse(request.url, true);
    console.log(urlParsed);

    if (urlParsed.pathname === '/echo' && urlParsed.query.message) {
        response.setHeader('Cache-control', 'no-cache');
        response.end(urlParsed.query.message);
    } else {
        response.statusCode = 404;
        response.end('Page not found!');
    }

}).listen(1337, '127.0.0.1');