'use strict';

var fs = require('fs');

var stream = new fs.ReadStream('1big.txt', {encoding: 'utf-8'});

stream.on('readable', function () {
    var data = stream.read();
    console.log(data);
});

stream.on('end', function () {
    console.log('END READING DATA');
});

stream.on('error', function (error) {
    if (error.code === 'ENOENT') {
        console.log('FILE NOT FOUND');
    } else {
        console.log(error);
    }
});