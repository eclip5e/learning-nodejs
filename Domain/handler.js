'use strict';

var fs = require('fs');
var redis = require('redis').createClient();

module.exports = function handler(request, response) {
    if (request.url === '/') {

        fs.readFile('no_such_file', function (error, content) {
            if (error) throw error;
            response.end(content);
        })

        redis.get('data', function (error, data) {

            throw new Error('Redis callback');

        })

    } else {

        response.statusCode = 404;
        response.end('404: Page not Found');

    }
};