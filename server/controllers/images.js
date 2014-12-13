var Image = require('mongoose').model('Image'),
	Album = require('mongoose').model('Album'),
	mongoose = require('mongoose'),
	deleteKey = require('key-del'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	_=require('lodash'),
	html_strip=require('htmlstrip-native');//Library for Array


//Get - Round1
exports.getImage= function (req, res) {
	Image.find({_id:req.params.image_id}).exec(function(err,getImage){
		if (err) return res.json(err);
		return res.json({status:"success",getImage:getImage});
	});
};

//Put - Round1
exports.updateImage= function (req, res) {
	var image=commFunc.removeInvalidKeys(req.body,['path','caption','comments']);

	Image.update({ _id:req.params.image_id }, image, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};

//Delete - Round1
exports.deleteImage= function (req, res) {
	Image.findOneAndRemove({_id:req.params.image_id},function (err) {
		if (err) return res.json(err);
		return res.json({status: "successfully removed from Image"});
	});
};

//Post - Round1
exports.addCommentToImage= function (req, res) {
	Image.findById(req.params.image_id).exec(function(err, image){
		if (err) return res.json(err);

		var comment = req.body;
		errors = commFunc.checkRequiredFields(comment, ['comment']);
		if(errors>0) return res.json(errors);

		//TODO html_strip is cutting off very last letter in comment
		comment = {
			userId:	req.user._id,
			comment: html_strip.html_strip(comment.comment, commFunc.htmlStripOptions),
			profileImg: req.user.profileImg,
			firstName: req.user.firstName,
			lastName: req.user.lastName
		};
		image.comments.push(comment);
		image.save(function(){
			if (err) return res.json(err);
			return res.json({status: "success",image:image});
		});
	});
};

//Put - Round1
exports.updateCommentFromImage= function (req, res) {
	var commentObj=commFunc.removeInvalidKeys(req.body,['comments']);
	Image.findOne({ _id:req.params.image_id }, function (err, image) {
		if (err) return res.json(err);

		var comment = image.comments.id(req.params.comment_id);
		comment.comment = commentObj.comment;

		image.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};
//Delete - Round1
exports.deleteCommentFromImage= function (req, res) {
	Image.findOne({ _id:req.params.image_id }, function (err, image) {
		if (err) return res.json(err);

		var comment = image.comments.id(req.params.comment_id).remove();

		image.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};