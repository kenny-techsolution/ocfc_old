var mongoose = require('mongoose'),
	InviteOtherToFellowship = require('mongoose').model('InviteOtherToFellowship'),
	FellowshipUser = require('mongoose').model('FellowshipUser'),
	User = require('mongoose').model('User'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	_ = require('lodash');//Library for Array


/* ------ Invite Other To Fellowships related API -------- */
//Post - Round1
exports.createInvite = function (req, res) {
	//user must be logged in & must belong to that specific fellowship in order to invite
	FellowshipUser.count({userId: req.user._id, fellowshipId: req.params.fellowship_id, status: 'approved'}, function (err, count) {
		if (err) return res.json(err);

		if (count > 0) {
			//check if invitee's email already exist
			var inviteOtherToFellowship = new InviteOtherToFellowship();

			inviteOtherToFellowship.fellowshipId = req.params.fellowship_id;
			inviteOtherToFellowship.inviter = req.user._id;
			inviteOtherToFellowship.invitee = req.body.invitee;
			inviteOtherToFellowship.email = req.body.email;
			inviteOtherToFellowship.welcomeMessage = req.body.welcomeMessage;

			User.count({userName: req.body.email}, function (err, count) {
				if (err) return res.json(err);

				if (count == 0) {
					inviteOtherToFellowship.save(function (err) {
						if (err) return res.json(err);
						return res.json({status: "success", inviteOtherToFellowship: inviteOtherToFellowship});
					});
				}
			});
		}
		;
	});
};
//Get - Round1
exports.queryInvites = function (req, res) {
	//query from a particular fellowship
	//user parameter passes as search criteria
	//filter out any non-qualified parameter keys using lo-dash
	var validKeys=commFunc.removeInvalidKeys(req.query,["fellowshipId","inviter","invitee","email","welcomeMessage","invitedOn"]);
	InviteOtherToFellowship.find(validKeys).exec(function (err, invitedUsers) {
		if (err) return res.json(err);
		return res.json({status:"success",invitedUsers:invitedUsers});
	});

};

//Get - Round1
exports.getInvite = function (req, res) {
	InviteOtherToFellowship.find({_id:req.params.id}).exec(function (err, invitedUser) {
		if (err) return res.json(err);
		return res.json({status:"success",invitedUser:invitedUser});
	});
};


//Delete - Round1
exports.deleteInvite = function (req, res) {
	//Delete if session user is the inviter
	if (req.user._id==req.body.inviter){
		InviteOtherToFellowship.remove({_id:req.params.id},function (err) {
			if (err) return res.json(err);
			return res.json({status:"successfully removed from InviteOtherToFellowship"});
		});

	};

};
