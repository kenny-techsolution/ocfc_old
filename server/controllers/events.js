var Event = require('mongoose').model('Event'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	_=require('lodash'),
	html_strip=require('htmlstrip-native');


//Get - Round1
exports.getEvent= function (req, res) {
	Event.findOne({_id:req.params.event_id}).exec(function(err,event){
		if (err) return res.json(err);
		return res.json({status:"success",event:event});
	});
};

//Put - Round1
exports.updateEvent= function (req, res) {
	var event=commFunc.removeInvalidKeys(req.body,['comments','links','title','description',
												   'fromDate','toDate','where','banner','invitees',
												   'gos','noGos','maybes']);

	Event.update({ _id:req.params.event_id }, event, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};
//Delete - Round1
exports.deleteEvent= function (req, res) {
	Event.findOneAndRemove({hostBy:req.user._id,_id:req.params.event_id},function (err) {
		if(err) return res.json(err);
		return res.json({status: "successfully removed from Event"});
});
};
//Post - Round1
exports.addCommentToEvent= function (req, res) {
	Event.findById(req.params.event_id).exec(function(err, event){
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
		event.comments.push(comment);
		event.save(function(){
			if (err) return res.json(err);
			return res.json({status: "success",event:event});
		});
	});
};
//Put - Round1
exports.updateCommentFromEvent= function (req, res) {
	var commentObj=commFunc.removeInvalidKeys(req.body,['comment']);

	Event.findOne({ _id:req.params.event_id }, function (err, event) {
		if (err) return res.json(err);

		var comment = event.comments.id(req.params.comment_id);
		comment.comment = commentObj.comment;

		event.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};

//Delete - Round1
exports.deleteCommentFromEvent= function (req, res) {
	Event.findOne({ _id:req.params.event_id }, function (err, event) {
		if (err) return res.json(err);

		var comment = event.comments.id(req.params.comment_id).remove();

		event.save(function(err){
			if (err) return res.json(err);
			return res.json({status:"success",comment:comment});
		});
	});
};