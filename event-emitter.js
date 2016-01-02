'use strict';

var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter();

server.on('eventName', function (request) {
    request.initiallyProcessed = true;
});

server.on('eventName', function (request) {
    console.log(request);
});

server.emit('eventName', {data: 'Some useful data...'});
server.emit('eventName', {data: 'More data...'});

server.on('error', function (err) {});

server.emit('error');

// Memory leak.

var db = new EventEmitter();

function Request() {
    var self = this;

    this.bigData = new Array(1e6).join('*');

    this.send = function(data) {
        console.log(data);
    };

    function onData(info) {
        self.send(info);
    }

    this.finish = function () {
        db.removeListener('data', onData);
    };

    db.on('data', onData);
}

setInterval(function () {
    var request = new Request();
    request.finish();
    console.log(process.memoryUsage().heapUsed);
    console.log(db);
}, 300);
