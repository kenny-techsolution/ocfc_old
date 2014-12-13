var Fellowship = require('mongoose').model('Fellowship'),
	FellowshipUser = require('mongoose').model('FellowshipUser'),
	Church = require('mongoose').model('Church'),
	ChurchFellowship = require('mongoose').model('ChurchFellowship'),
	ChurchUser = require('mongoose').model('ChurchUser'),
	Membership = require('mongoose').model('Membership'),
	Album = require('mongoose').model('Album'),
	Calendar = require('mongoose').model('Calendar'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	async = require('async'),
	_ = require('lodash');//Library for Array

//Post - Round1
exports.createFellowship = function (req, res) {
	var fellowship = req.body;

	//TODO, prevent duplicate fellowship
	//compared by name, address, if there's associated church,
	//admin cannot create duplicate fellowships
	var fellowship=commFunc.removeInvalidKeys(req.body,['name','slogan','about','address','city',
														'country','zipcode']);
	fellowship = new Fellowship(fellowship);
	fellowship.save(function (err) {
		if (err) return res.json(err);

		var fellowshipUser = new FellowshipUser();
		fellowshipUser.userId = req.user._id;
		fellowshipUser.fellowshipId = fellowship._id;
		fellowshipUser.status = 'pending';
		fellowshipUser.role = 'admin';

		fellowshipUser.save(function (err) {
			if (err) return res.json(err);
			return res.json({status: "success", fellowship: fellowship});
		});
	})
};

var approveFellowship = function (fellowshipId,req,res) {
	Fellowship.findById(fellowshipId).exec(function (err, fellowship) {
		console.log('chk fellowship');
		console.log(fellowship);
		if (err) return res.json(err);
		var album = new Album({name: "Fellowship Photos", createdBy: req.user._id});
		var calendar = new Calendar({createdBy: req.user._id,ownerType: "fellowship", fellowshipId: fellowship._id, title: "Fellowship Calendar"});
		var albumId, calendarId;
		async.parallel([
			function (callback) {
				console.log("create a default album");
				album.save(function (err) {
					if (err) return callback(err);
					albumId = album._id;
					callback(null);
				});
			},
			function (callback) {
				console.log("create a default calendar");
				calendar.save(function (err) {
					if (err) return callback(err);
					calendarId = calendar._id;
					callback(null);
				});
			}
		], function (err) {
			console.log("update fellowship");
			if (err) return res.json(err);
			fellowship.approved = true;
			fellowship.defaultAlbumId = albumId;
			fellowship.calendarIds = calendarId;
			fellowship.save(function (err) {
				if (err) return res.json(err);
				//approve the fellowship admin as well.
				FellowshipUser.findOne({fellowshipId: fellowship._id, role: "admin"}, function (err, fellowshipUser) {
					if (err) return res.json(err);
					console.log(fellowshipUser);

					fellowshipUser.status = "approved";
					fellowshipUser.save(function (err) {
						if (err) return res.json(err);
						var pushObj = {
							fellowshipId: fellowship._id,
							name: fellowship.name,
							role: "admin"
						}
						//Update membership table
						Membership.update({userId: fellowshipUser.userId, 'fellowships.fellowshipId': {$ne: fellowship._id}},
										  {$push: {fellowships: pushObj}}, function (err) {
							if (err) return res.json(err);
							return res.json({status: "fellowship is approved"});
						});
					});
				});
			});
		});
	});
};

//Put - Round1
exports.updateFellowshipById = function (req, res) {
	//Scenario: site admin approves the fellowship.
	if (req.user.userName === 'yoyocicada@gmail.com' && req.body.status === "approved") {
		return approveFellowship(req.params.id, req,res);
	}

	//TODO test this scenario after creation of church
	//Scenario: church admin approves the fellowship.
	if (req.body.status === "approved") {
		//1. find out the churchId it associated with this fellowship.
		ChurchFellowship.findOne({fellowshipId:req.params.id}).exec(function (err, churchFellowship) {
			if (err) return res.json(err);
			//2. check current user is the church admin.
			if(commFunc.isChurchAdmin(req.user, churchFellowship.churchId)) {
				//3. approve the fellowship and add approve fellowship admin user.
				return approveFellowship(req.params.id, req,res);
			} else {
				return res.json({status: "fail", message: 'your are not allowed to approve the fellowship'});
			}
		});
	} else {
		//regular fellowship content update by fellowship admin
		FellowshipUser.count({userId: req.user._id, fellowshipId: req.params.id, role: 'admin', status: 'approved'}, function (err, count) {
			if (err) return res.json(err);
			if (count > 0) {
				var fellowship=commFunc.removeInvalidKeys(req.body,['name','slogan','about','address','city',
					'country','zipcode']);
				Fellowship.update({ _id: req.params.id}, fellowship, { multi: true }, function (err, numberAffected, raw) {
					if (err) return res.json(err);
					return res.json({status: "success", raw: raw});
				});
			}
			;
		});
	}
};

//Get - Round1
exports.getFellowshipById = function (req, res) {
	//chk if entry exist match by fellowshipId & status of approved
	FellowshipUser.count({ fellowshipId: req.params.id, userId: req.user._id, status: 'approved'}, function (err, count) {
		if (count == 1) {
			Fellowship.findOne({_id: req.params.id}).exec(function (err, fellowship) {
				if (err) return res.json(err);
				return res.json({status: "success", fellowship: fellowship});
			});
		} else {
			Fellowship.findOne({_id: req.params.id}, '-albumIds -fileIds -calendarIds').exec(function (err, fellowship) {
				if (err) return res.json(err);
				return res.json({status: "success", fellowship: fellowship});
			});

		}
		;
	});

};

//Delete - Round 1
exports.deleteFellowshipById = function (req, res) {
	// Session user must be an admin in order to delete
	// fellowship from Fellowship & FellowUser Models
	if(!commFunc.isFellowshipAdmin(req.user ,req.params.id)) {
		return res.json({status:'fail', message:'you are not an admin for this fellowship.'});
	}
	Fellowship.findOneAndUpdate({_id:req.params.id},{active:false},function(err){
		if(err) return res.json(err);
		return res.json({status:'success',church:'Fellowship has been de-activated'});
	});
};

//Post - Round1
exports.addUserToFellowship = function (req, res) {
	//Populate data onto FellowshipUsers tbl
	Fellowship.count({ _id: req.params.fellowship_id}, function (err, count) {

		if (count == 1) {
			var fellowshipUser = req.body;
			fellowshipUser.userId = req.user._id;
			fellowshipUser.fellowshipId = req.params.fellowship_id;

			fellowshipUser.status = "Pending";
			fellowshipUser.role = 'member';
			fellowshipUser = new FellowshipUser(fellowshipUser);
			fellowshipUser.save(function (err) {
				if (err) return res.json(err);
				return res.json({status: "success", fellowshipUser: fellowshipUser});
			})
		}
	});
};

//Get - Round1
exports.getUsersFromFellowship = function (req, res) {
	//Populate users associated to a fellowship
	//Search FellowUser model by fellowshipId against param id,
	//then populate user table
	console.log(req.user);
	FellowshipUser.find({fellowshipId: req.params.fellowship_id, status: 'approved'}).populate("userId").exec(function (err, fellowshipUser) {
		if (err) return res.json(err);
		return res.json({status: "success", fellowshipUsers: _.pluck(fellowshipUser, 'userId')});
	});
};

//Put - Round 1
exports.updateUserToFellowship = function (req, res) {
	if(!commFunc.isFellowshipAdmin(req.user ,req.params.fellowship_id)) {
		return res.json({status:'fail', message:'you are not an admin for this fellowship.'});
	}
	var fellowshipUserObj = commFunc.removeInvalidKeys(req.body,['status','role','rejectReason','updateDate']);
	var preStatus;
	var fellowshipUserInstance;
	async.series([
		function(callback){
			console.log("retrieve the fellowshipUser instance");
			FellowshipUser.findOne({userId: req.params.user_id, fellowshipId: req.params.fellowship_id}).populate('fellowshipId').exec(function(err, fellowshipUser){
				if (err) callback(err);
				fellowshipUserInstance = fellowshipUser;
				callback();
			});
		},
		function(callback){
			console.log("update the fellowshipUser instance");
			preStatus = fellowshipUserInstance.status;
			if(fellowshipUserObj.status === preStatus || ['rejected', 'approved', 'pending'].indexOf(fellowshipUserObj.status)===-1) {
				return res.json({status:'fail', message: 'invalid status string or update with the same status value.'});
			}
			if(fellowshipUserObj.status === 'rejected' && !fellowshipUserObj.rejectReason) {
				return res.json({status:"fail", message: "to reject, you must provide a reason"});
			}
			fellowshipUserInstance = commFunc.updateInstanceWithObject(fellowshipUserObj, fellowshipUserInstance);
			console.log(fellowshipUserInstance);
			fellowshipUserInstance.save(function(err){
				if (err) callback(err);
				callback();
			});
		},
		function (callback){
			async.parallel([
				function(callback){
					console.log("add fellowship to the user's membership tbl.");
					if (preStatus === 'pending' && fellowshipUserInstance.status === 'approved') {
						var fellowship = {
								fellowshipId: fellowshipUserInstance.fellowshipId._id,
								name: fellowshipUserInstance.fellowshipId.name,
								role: fellowshipUserInstance.role
							};
						Membership.findOneAndUpdate({userId: req.params.user_id, 'fellowships.fellowshipId':{$ne: fellowshipUserInstance.fellowshipId._id}},{$push:{fellowships:fellowship}}).exec(function(err){
							if (err) return callback(err);
							callback();
						});
					}
				},
				function(callback){
					//TODO: test the scenario where there is church that this fellowship belonged to.
					async.waterfall([
						function(callback){
							console.log("see if this fellowship has any church.");
							ChurchFellowship.findOne({fellowshipId: fellowshipUserInstance.fellowshipId._id}).select('churchId').exec(function (err, churchFellowship) {
								if (err) return callback(err);
								if(!churchFellowship) return callback("This fellowhsip has no church connected.");
								callback(null, [churchFellowship]);
							});
						},
						function(result, callback){
							console.log("add this user to that church if churchfellowship instance exists.");
							var churchFellowship = result[0];
							var churchUser = {
								churchId: churchFellowship.churchId,
								userId: fellowshipUserInstance.userId,
								status: "approved",
								role: "member"
							};
							ChurchUser.update({churchId: churchFellowship.churchId, userId: fellowshipUserInstance.userId}, churchUser, {upsert:true}, function(err){
								if (err) return callback(err);
								callback(null, result);
							});
						},
						function(result, callback){
							console.log("need to find the church name first for updating membership tbl.");
							console.log(result);
							var churchFellowship = result[0];
							//and updated membership tbl. need to find the church name first.
							Church.find({_id: churchFellowship.church_id}, 'name').exec(function (err, church) {
								if (err) return callback(err);
								callback(null, [churchFellowship,church]);
							});
						},
						function(result, callback){
							console.log("update membership tbl. ");
							var churchFellowship = result[0];
							var church = result[1];
							Membership.update({'userId': req.user._id, 'churches.churchId': {$ne: churchFellowship.churchId}}, {$push: {churches: {churchId: churchFellowship.churchId, name: church.name, role: "member"}}}, function (err) {
								if (err) return callback(err);
								callback(null, result);
							});
						}
					], callback);
				}
			],callback);
		}
	],function(err){
		console.log("finally done");
		if (err) return res.json(err);
		return res.json({status:"success", message: "user is updated on the fellowship."});
	});
};

//Delete - Round 1
exports.removeUserFromFellowship = function (req, res) {
	// fellowship from Fellowship & FellowUser Models
	FellowshipUser.findOne({userId: req.params.user_id, fellowshipId: req.params.fellowship_id, status: 'approved'}, function (err, fellowshipUser) {
		if (err) return res.json(err);
		if(commFunc.isFellowshipMember(req.user ,req.params.fellowship_id) || req.user._id === req.params.user_id) {
			// send out email to notify user about delection.
			FellowshipUser.remove({fellowshipId: req.params.fellowship_id, userId: req.params.user_id}, function (err) {
				if (err) return res.json(err);
				//remove this fellowship from all membership.
				Membership.update({userId: req.params.user_id, 'fellowships.fellowshipId': req.params.fellowship_id}, {$pull: {fellowships: {fellowshipId: req.params.fellowship_id}}}, function (err) {
					if (err) return res.json(err);
					return res.json({status: "successfully removed from FellowshipUser"});
				});
			});
		} else {
			return res.json({status:"success", message: "you are not allowed to remove this user from fellowship."});
		}
	});
};
