var passport = require('passport'),
	mongoose = require('mongoose'),
	Membership = mongoose.model('Membership'),
	LocalStrategy = require('passport-local').Strategy,
	User = mongoose.model('User'),
	_ = require('lodash');//Library for Array

module.exports = function () {
	passport.use(new LocalStrategy(
		function (username, password, done) {
			console.log("calling passport.js login function");
			User.findOne({userName: username, active:true},'+salt +hashedPwd').exec(function (err, user) {
				if (user && user.authenticate(password)) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			})
		}
	));

	passport.serializeUser(function (user, done) {
		if (user) {
			done(null, user._id);
		}
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({_id: id}).exec(function (err, user) {
			if (user) {
				Membership.findOne({userId: user._id}, function(err, membership){
					user.set('fellowships', membership.fellowships);
					user.set('churches', membership.churches);
					console.log("user");
					console.log(user);
					var extendedUser = _.merge(membership, user);

					return done(null, extendedUser.toObject());
				});
			}
			else {
				return done(null, false);
			}
		});
	});
};
