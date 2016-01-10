'use strict';

/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var schema = mongoose.Schema({
    name: String
});

schema.methods.meow = function () {
    console.log(this.get('name') + ' says: Meoooooowwww!');
};

var Cat = mongoose.model('Cat', schema);

var kitty = new Cat({ name: 'Zildjian' });

kitty.save(function (err, kitty, affected) {
    kitty.meow();
});
*/

var User = require('models/user').User;

var user = new User({
    username: 'Tester3',
    password: '1111'

});

user.save(function (error, user, affected) {
    console.log(arguments);

    User.findOne({username: 'Tester'}, function (err, tester) {
        console.log(tester);
    });
});