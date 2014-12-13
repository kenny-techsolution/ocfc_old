/*************************************************************************************
This file extends from passport.js which authenticate user using Passport module
 ***************************************************************************************/
var passport = require('passport'),
	mongoose = require('mongoose'),
	FellowshipUser = mongoose.model('FellowshipUser'),
	ChurchUser = mongoose.model('ChurchUser');

exports.authenticate = function (req, res, next) {
	//console.log(req);
	var auth = passport.authenticate('local', function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			res.send({success: false})
		}
		console.log(user);
		req.logIn(user, function (err) {
			console.log("here goes the step C");

			if (err) {
				return next(err);
			}
			res.send({success: true, user: user});
		});
	});
	auth(req, res, next);
};

//Function that will authenticate currentUser
exports.requiresApiLogin = function (req, res, next) {
	if (!req.isAuthenticated()) {
		console.log("test !req.isAuthenticated() in auth.js");
		console.log(!req.isAuthenticated());
		res.status(403);
		res.end();
	} else {
		next();
	}
};

exports.requiresRole = function (role) {
	return function (req, res, next) {
		if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
			res.status(403);
			res.end();
		} else {
			next();
		}
	}
};