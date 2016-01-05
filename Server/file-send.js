'use strict';

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var ROOT = __dirname + '\\public';

function checkAccess(request) {
    return url.parse(request.url, true).query.secret === 'o_O';
}

function sendFileSafe(filePath, response) {

    try {
        filePath = decodeURIComponent(filePath);
    } catch (error) {
        response.statusCode = 400;
        response.end('Bad Request!');
        return;
    }

    if (~filePath.indexOf('\0')) {
        response.statusCode = 400;
        response.end('Bad Request!');
        return;
    }

    filePath = path.normalize(path.join(ROOT, filePath));
    console.log(filePath);

    if (filePath.indexOf(ROOT) !== 0) {
        response.statusCode = 404;
        response.end('File not Found!');
        return;
    }

    fs.stat(filePath, function (error, stats) {
        if (error || !stats.isFile()) {
            console.log(error);
            console.log(stats);
            response.statusCode = 404;
            response.end('File not Found!');
            return;
        }

        sendFile(filePath, response);
    });

}

function sendFile(filePath, response) {

    fs.readFile(filePath, function (error, content) {
        if (error) throw error;

        var mime = require('mime').lookup(filePath);
        response.setHeader('Content-Type', mime + '; charset=utf-8');
        response.end(content);
    });

}

http.createServer(function (request, response) {

    if (!checkAccess(request)) {
        response.statusCode = 403;
        response.end('Wrong secret!');
        return;
    }

    sendFileSafe(url.parse(request.url).pathname, response);

}).listen(1337);