var db = require('db');
db.connect();

var log = require('logger')(module);

var UserFactory = require('./user');

function initialize() {
    var kolya = new UserFactory('Kolya');
    var borya = new UserFactory('Borya');

    kolya.greet();
    borya.greet();

    log(db.getTranslation('Initialization successful'));
}

if (module.parent) {
    console.log('File [server.js] is required by some other module. Exporting functionality...');
    exports.init = initialize;
} else {
    console.log('File [server.js] was called directly. Running initialization function...');
    initialize();
}
