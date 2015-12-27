var db = require('db');
var log = require('logger')(module);

function User(name) {
    this.name = name;
}

User.prototype.greet = function() {
    log(db.getTranslation('Hello') + '!, ' + this.name + '!');
};

module.exports = User;
