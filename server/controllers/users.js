var User = require('mongoose').model('User'),
	Membership = require('mongoose').model('Membership'),
	encrypt = require('../utilities/encryption'),
	deleteKey = require('key-del'),
	_=require('lodash'), //Library for Array
	html_strip=require('htmlstrip-native'),
	commFunc = require('../utilities/commonFunctions');


//Post - Round1
exports.createUser=function (req, res) {
	var user = req.body;
	var salt = encrypt.createSalt();
	user.salt = salt;
	user.hashedPwd = encrypt.hashPwd(salt, user.password);

	user = new User(user);
	user.save(function (err) {
		if (err) return res.json(err);
		var membership=new Membership({userId:user._id});
		membership.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",user:user});
		});
	})
};

//Put - Round1
exports.updateUser=function (req, res) {
	var user = commFunc.removeInvalidKeys(req.body,['firstName','lastName','birthday','gender','profileImg',
													'about','place','coordinates','language','active']);
	User.findOneAndUpdate({ _id:commFunc.reqSessionUserId(req)},user, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};

//Get - Round1
exports.getUserById=function (req, res) {
	User.findOne({_id: req.params.id}).exec(function (err, user) {
		if (err) return res.json(err);
		return res.json({status:"success",user:user});
	});
};

//Delete - Round1
exports.deleteUser=function (req, res) {
	//TODO implement custom remove to rid all referencing objects
	User.update({_id:commFunc.reqSessionUserId(req)},{active:false}, function (err) {
		if (err) return res.json(err);
		return res.json({status:"successfully de-activated acct"});
	});
};

//Put - Round1
exports.updateProfileImage=function (req, res) {
	var user={profileImg: req.body.profileImg};
	// Strip tags and decode HTML entities to prevent hacking
	//TODO image validation needed
	user.profileImg = html_strip.html_strip(user.profileImg,commFunc.htmlStripOptions);

	if(user.profileImg!==null || user.profileImg!==""){
		User.update({ _id: commFunc.reqSessionUserId(req)}, user, function (err, numberAffected, raw) {
			if (err) return res.json(err);
			return res.json({status:"success",raw:raw});
		})
	}else{
		return res.json({status:"no image id"});
	}
};

//TODO Get
exports.resetPassword=function (req, res) {
	res.end();
};

//TODO Put
exports.updateEventParticipation=function (req, res) {
	res.end();
};
