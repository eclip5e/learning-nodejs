'use strict';

var events = require('events');
var serverEmitter = new events.EventEmitter();
var sessionStore = require('../libs/sessionStore');

function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length === 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

module.exports = function (io) {

    serverEmitter.on('io:session:reload', function (sid) {
        console.log('-> CAUGHT SESSION:RELOAD EVENT FOR SESSION.', sid);

        var ns = io.of('/');

        var clients = [];

        for (var id in ns.connected) {
            clients.push(ns.connected[id]);
        }

        clients.forEach(function (client) {
           console.log('CLIENT:', client);

            loadSession(sid, function (err, session) {

                if (err) {
                    client.emit('error', 'server error');
                    client.disconnect();
                    return;
                }

                if (!session) {
                    client.emit('logout');
                    client.disconnect();
                    return;
                }

                client.handshake.session = session;
            })
        });
    });

    return serverEmitter;

};