'use strict';

var fs = require('fs');

fs.readFile(__filename, {encoding: 'utf-8'}, function (error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data.toString());
    }
});

fs.stat(__filename, function (error, stats) {
    console.log(stats.isFile());
    console.log(stats);
});

fs.writeFile('file.txt', 'Some data', function (error) {
    if (error) throw error;

    fs.rename('file.txt', 'new.txt', function (error) {
        if (error) throw error;

        fs.unlink('new.txt', function (error) {
            if (error) throw error;
        });
    })
});