'use strict';

module.exports = function (server) {

    var io = require('socket.io')(server);
    io.origins('127.0.0.1:*');

    io.on('connection', function (socket) {

        socket.on('message', function (text, cb) {
            socket.broadcast.emit('message', text);
            cb('123');
        });

    });

};
