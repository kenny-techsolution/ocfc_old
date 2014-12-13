var File = require('mongoose').model('File'),
	Folder = require('mongoose').model('Folder'),
	mongoose = require('mongoose'),
	deleteKey = require('key-del'),
	_=require('lodash'),
	commFunc = require('../utilities/commonFunctions'),
	html_strip=require('htmlstrip-native');//Library for Array;


//Get - Round1
exports.getFile=function (req, res) {
	File.find({_id:req.params.file_id}).exec(function(err,getFile){
		if (err) return res.json(err);
		return res.json({status:"success",getFile:getFile});
	});
};

//Put - Round1
exports.updateFile=function (req, res) {
	var file=commFunc.removeInvalidKeys(req.body,['name','path','comments']);
	file.name=file.name;
	file.path=file.path;

	File.update({ _id:req.params.file_id}, file, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};

//Delete - Round1
exports.deleteFile=function (req, res) {
	File.findOneAndRemove({_id:req.params.file_id},function (err) {
		if (err) return res.json(err);
		return res.json({status: "successfully removed from File"});
	});
};

//Post - Round1
exports.addCommentToFile=function (req, res) {
	File.findById(req.params.file_id).exec(function(err, file){
		if (err) return res.json(err);

		var comment = req.body;
		var errors = commFunc.checkRequiredFields(comment, ['comment']);

		if(errors>0) return res.json(errors);

		//TODO html_strip is cutting off very last letter in comment
		comment = {
			userId:	req.user._id,
			comment: html_strip.html_strip(comment.comment, commFunc.htmlStripOptions),
			profileImg: req.user.profileImg,
			firstName: req.user.firstName,
			lastName: req.user.lastName
		};

		file.comments.push(comment);
		file.save(function(){
			if (err) return res.json(err);
			return res.json({status: "success",file:file});
		});
	});
};
//Put - Round1
exports.updateCommentFromFile=function (req, res) {
	var commentObj=commFunc.removeInvalidKeys(req.body,['comments']);

	File.findOne({ _id:req.params.file_id }, function (err, file) {
		if (err) return res.json(err);

		var comment = file.comments.id(req.params.comment_id);
		comment['comment'] = commentObj.comment;

		file.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};

//Delete - Round1
exports.deleteCommentFromFile=function (req, res) {
	File.findOne({ _id:req.params.file_id }, function (err, file) {
		if (err) return res.json(err);

		var comment = file.comments.id(req.params.comment_id).remove();

		file.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};
