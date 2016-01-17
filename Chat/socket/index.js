'use strict';

var cookie = require('cookie');
var config = require('../config');
var cookieParser = require('cookie-parser');
var sessionStore = require('../libs/sessionStore');
var async = require('async');
var HttpError = require('../error').HttpError;
var log = require('libs/log')(module);
var User = require('../models/user').User;

function loadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length === 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {

    if (!session.user) {
        log.debug('Session %s is anonymous', session.id);
        return callback(null, null);
    }

    log.debug('Retrieving user:', session.user);

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        log.debug('User findById result: ' + user);
        callback(null, user);
    });

}

module.exports = function (server) {

    console.log('-> INITIALIZING CHAT MODULE');

    var io = require('socket.io')(server);
    io.origins('127.0.0.1:*');

    // Authentication.
    io.use(function(socket, next) {

        var handshakeData = socket.request;

        async.waterfall([
            function (callback) {

                console.log('-> WORKING WITH HANDSHAKE', handshakeData.headers.cookie);

                handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
                console.log('-> GOT COOKIE:', handshakeData.cookies);
                var sidCookie = handshakeData.cookies.sid;
                var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
                console.log('-> SESSION ID', sid);
                loadSession(sid, callback);

            },
            function (session, callback) {

                console.log('-> SESSION:', session);
                if (!session) {
                    callback(new HttpError(401, 'No session'));
                }

                socket.handshake.session = session;
                loadUser(session, callback);

            },
            function (user, callback) {
                if (!user) {
                    callback(new HttpError(403, 'Anonymous session may not connect'));
                }

                socket.handshake.user = user;
                callback(null);
            }
        ], function (err) {
            if (!err) {
                console.log('-> SUCCESSFULLY AUTHORIZED!');
                return next(null, true);
            }

            if (err instanceof HttpError) {
                return next(null, false);
            }

            next(err);
        });

    });

    io.on('connection', function (socket) {

        var username = socket.handshake.user.username;

        socket.broadcast.emit('join', username);

        socket.on('message', function (text, cb) {
            socket.broadcast.emit('message', username, text);
            cb && cb();
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username);
        });

        //socket.on('session:reload', function (sid) {
        //    console.log('-> CAUGHT SESSION:RELOAD EVENT.', sid);
        //});

    });

    return io;

};
