'use strict';

var http = require('http');

console.log(process.env);

var options = require('optimist').argv;

http.createServer(function (req, res) {
    res.end('Server is running');
}).listen(options.port);