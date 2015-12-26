var i18n = require('./ru.json');

function User(name) {
    this.name = name;
}

User.prototype.greet = function() {
    console.log(i18n.Hello + '!, ' + this.name + '!');
};

exports.User = User;
