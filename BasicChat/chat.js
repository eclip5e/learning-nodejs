'use strict';

var clients = [];

exports.subscribe = function (request, response) {
    console.log('-> SUBSCRIBED');

    clients.push(response);

    response.on('close', function () {
        clients.splice(clients.indexOf(response), 1);
    });
};

exports.publish = function (message) {
    console.log('-> PUBLISH: %s', message);

    clients.forEach(function (response) {
        response.end(message);
    });

    clients = [];
};

setInterval(function () {
    console.log(clients.length);
}, 2000);