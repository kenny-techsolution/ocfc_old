var Post = require('mongoose').model('Post'),
	Event = require('mongoose').model('Event'),
	Image = require('mongoose').model('Image'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	html_strip = require('htmlstrip-native'),
	async = require('async'),
	_ = require('lodash');

var checkRequiredFieldsForPostType = function (postType, obj, fields) {
	var errors = []
	_.forEach(fields, function (key) {
		if (!_.has(obj, key)) {
			errors.push(key + " is required field for postType=" + postType);
		}
	});
	return errors;
};

var stripHtmlforFields = function (obj, fields) {
	_.forEach(fields, function (key) {
		obj[key] = html_strip.html_strip(obj[key], commFunc.htmlStripOptions);
	});
	return obj;
};

//round-1
var savePost = function (post, res) {
	post.save(function (err) {
		if (err) return res.json(err);
		Post.populate(post, 'eventId general testimony', function (err, post) {
			if (err) return res.json(err);
			return res.json(post);
		});
	});
};

//round-1
var createQuestionPost = function (postObj, req, res) {
	var errors = commFunc.checkRequiredFieldsForPostType(postObj.postType, postObj, ['postUnderGroupType', 'postUnderGroupId', 'content']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	postObj = stripHtmlforFields(postObj, ['content']);
	postObj.question = postObj.content;
	postObj.postBy = commFunc.reqSessionUserId(req);
	//TODO: perform image validation.
	var post = new Post(postObj);
	return savePost(post, res);
};
//round-1
var createPrayerPost = function (postObj, req, res) {
	var errors = commFunc.checkRequiredFieldsForPostType(postObj.postType, postObj, ['postUnderGroupType', 'postUnderGroupId', 'content']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	postObj = stripHtmlforFields(postObj, ['content']);
	postObj.prayer = postObj.content;
	postObj.postBy = commFunc.reqSessionUserId(req);
	//TODO: perform image validation.
	var post = new Post(postObj);
	return savePost(post, res);
};

//round-1
var createGeneralPost = function (postObj, req, res) {
	var errors = commFunc.checkRequiredFieldsForPostType(postObj.postType, postObj, ['postUnderGroupType', 'postUnderGroupId', 'content']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	postObj = stripHtmlforFields(postObj, ['content']);
	//TODO: perform image validation.
	postObj.general = [
		{ content: postObj.content}
	];
	postObj.postBy = commFunc.reqSessionUserId(req);
	var post = new Post(postObj);

	var imageIds = postObj.imageIds;

	//update all images for post.
	if (imageIds.length > 0) {
		async.forEachLimit(imageIds, 3, function (imageId, callback) {
			Image.findByIdAndUpdate(imageId, {used: true}, function (err) {
				if (err) return callback(err)
				callback();
			});
		}, function (err) {
			if (err) return res.json(err);
			return savePost(post, res);
		});
	} else {
		return savePost(post, res);
	}
};
//round-1
var createTestimonyPost = function (postObj, req, res) {
	var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['postUnderGroupType', 'postUnderGroupId', 'content', 'title']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	postObj = stripHtmlforFields(postObj, ['content', 'title']);
	//TODO: perform image validation.
	postObj.testimony = [
		{ title: postObj.title, content: postObj.content}
	];
	postObj.postBy = commFunc.reqSessionUserId(req);
	post = new Post(postObj);

	var imageIds = postObj.imageIds;

	//update all images for post.
	if (imageIds.length > 0) {
		async.forEachLimit(imageIds, 3, function (imageId, callback) {
			Image.findByIdAndUpdate(imageId, {used: true}, function (err) {
				if (err) return callback(err)
				callback();
			});
		}, function (err) {
			if (err) return res.json(err);
			return savePost(post, res);
		});
	} else {
		return savePost(post, res);
	}
};

var createEventPost = function (postObj, req, res) {
	var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['postUnderGroupType', 'postUnderGroupId', 'title', 'description', 'fromDate', 'toDate', 'where', 'hostBy', 'invitees']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	postObj = stripHtmlforFields(postObj, ['title', 'description', 'where']);
	//TODO: perform image validation.
	event = new Event({
		title: postObj.title,
		imagesIds: postObj.imagesIds || [],
		description: postObj.description,
		fromDate: postObj.fromDate,
		toDate: postObj.toDate,
		where: postObj.where,
		hostBy: postObj.hostBy,
		invitees: postObj.invitees
	});
	event.save(function (err) {
		if (err) return res.json(err);
		var imageIds = postObj.imageIds;

		var post = new Post({
			postType: postObj.postType,
			postBy: commFunc.reqSessionUserId(req),
			eventId: event._id,
			postUnderGroupType: postObj.postUnderGroupType,
			postUnderGroupId: postObj.postUnderGroupId
		});

		//update all images for event post.
		if (imageIds.length > 0) {
			async.forEachLimit(imageIds, 3, function (imageId, callback) {
				Image.findByIdAndUpdate(imageId, {used: true}, function (err) {
					if (err) return callback(err)
					callback();
				});
			}, function (err) {
				if (err) return res.json(err);
				post.imageIds = imageIds;
				return savePost(post, res);
			});
		} else {
			return savePost(post, res);
		}
	});
};

var _updatePost = function (id, userId, postObj, res) {
	Post.findOneAndUpdate({_id: id, postBy: userId}, postObj, function (err, post) {
		if (err) return res.json(err);
		return res.json(post);
	});
};

var postFollowByImageUpdate=function(req,res,post){
	var imageIds = req.body.imageIds;

	//update all images for post.
	if(imageIds.length > 0){
		async.forEachLimit(imageIds, 3, function(imageId, callback) {
			Image.findByIdAndUpdate(imageId, {used: true}, function(err){
				if (err) return callback(err)
				callback();
			});
		}, function(err) {
			if (err) return res.json(err);
			return res.json(post);
		});
	} else {
		return res.json(post);
	}
};

exports.createPost = function (req, res) {
	var postObj = req.body;
	if (!commFunc.isGroupMember(postObj.postUnderGroupType, req.user, postObj.postUnderGroupId)) {
		return res.json({status: "fail", message: "you are not allowed to create post on this wall which you're not a member of."});
	}

	postObj = deleteKey(postObj, ['comments', 'updatedOn', 'postBy']);
	if (_.has(postObj, 'postType')) {
		if (postObj.postType === 'question') {
			return createQuestionPost(postObj, req, res);
		}
		if (postObj.postType === 'prayer') {
			return createPrayerPost(postObj, req, res);
		}
		if (postObj.postType === 'general') {
			return createGeneralPost(postObj, req, res);
		}
		if (postObj.postType === 'testimony') {
			return createTestimonyPost(postObj, req, res);
		}
		if (postObj.postType === 'event') {
			return createEventPost(postObj, req, res);
		}
	}
};

exports.getPost = function (req, res) {
	Post.findById(req.params.id).populate('eventId').exec(function (err, post) {
		if (err) return res.json(err);
		if (!commFunc.isGroupMember(post.postUnderGroupType.toString(), req.user, post.postUnderGroupId.toString())) {
			return res.json({status: "fail", message: "you are not allowed to get post on this wall which you're not a member of."});
		}
		return res.json(post);
	});
};

//get Round-1
exports.queryPost = function (req, res) {
	var postObj = req.query;
	var errors = commFunc.checkRequiredFields(postObj, ['postUnderGroupType', 'postUnderGroupId']);
	if (errors.length > 0) {
		return res.json({statue: "failed", errors: errors});
	}
	if (!commFunc.isGroupMember(postObj.postUnderGroupType, req.user, postObj.postUnderGroupId)) {
		return res.json({status: "fail", message: "you are not allowed to query posts on this wall which you're not a member of."});
	}

	var filteredKeys=commFunc.removeInvalidKeys(req.query,['postType', 'postBy', 'postUnderGroupType', 'postUnderGroupId']);
	var condition = {};
	var whereClause = {};
	_.forEach(filteredKeys, function (key) {
		if (key == 'postUnderGroupType') {
			whereClause.postUnderGroupType = req.query[key];
		} else if (key == 'postUnderGroupId') {
			whereClause.postUnderGroupId = req.query[key];
		} else {
			condition[key] = req.query[key];
		}
	});
	Post.find(condition).where(whereClause).exec(function (err, posts) {
		if (err) return res.json(err);
		return res.json(posts);
	});
};


//put . need to provide postType
exports.updatePost = function (req, res) {
	var postObj = req.body;

	postObj = deleteKey(postObj, ['comments', 'updatedOn', 'postBy']);
	if (_.has(postObj, 'postType')) {
		if (postObj.postType === 'question') {
			var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['content']);
			if (errors.length > 0) {
				return res.json({statue: "failed", errors: errors});
			}
			delete postObj.postType;
			postObj = stripHtmlforFields(postObj, ['content']);
			postObj.question = postObj.content;
			postObj.updatedOn = new Date();
			return _updatePost(req.params.id, commFunc.reqSessionUserId(req), postObj, res);
		}
		if (postObj.postType === 'prayer') {
			var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['content']);
			if (errors.length > 0) {
				return res.json({statue: "failed", errors: errors});
			}
			delete postObj.postType;
			postObj = stripHtmlforFields(postObj, ['content']);
			postObj.prayer = postObj.content;
			postObj.updatedOn = new Date();
			return _updatePost(req.params.id, commFunc.reqSessionUserId(req), postObj, res);
		}
		if (postObj.postType === 'general') {
			//step1-makes sure content entry exist
			var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['content']);
			if (errors.length > 0) {
				return res.json({statue: "failed", errors: errors});
			}

			//Remove postType field
			delete postObj.postType;

			//Format content for protection
			postObj = stripHtmlforFields(postObj, ['content']);

			//insert content into appropriate postType
			postObj.general = {
				content: postObj.content
			}
			//grab latest postObj and assign to post
			var post = new Post(postObj);
			console.log("postObj");
console.log(postObj);
			Post.findOneAndUpdate({_id: req.params.id, postBy: commFunc.reqSessionUserId(req)},{ "$set": {"general.0.content": postObj.content,"imageIds": postObj.imageIds }},
								   function(err, post){
									   if (err) return res.json(err);
									   return postFollowByImageUpdate(req,res,post);
								   });
		}
		if (postObj.postType === 'testimony') {
			var errors = checkRequiredFieldsForPostType(postObj.postType, postObj, ['content', 'title']);
			if (errors.length > 0) {
				return res.json({statue: "failed", errors: errors});
			}
			delete postObj.postType;
			postObj = stripHtmlforFields(postObj, ['content', 'title']);
			var testimony = {
				title: postObj.title,
				content: postObj.content
			};
//			post = new Post(postObj);

			Post.findOneAndUpdate({_id: req.params.id, postBy: commFunc.reqSessionUserId(req)},{ "$set": {"testimony.0" : testimony, "imageIds": postObj.imageIds}},
									function(err, post){
										if (err) return res.json(err);
										return postFollowByImageUpdate(req,res,post);
				});
		}
		if (postObj.postType === 'event') {
			delete postObj.postType;
			Post.findOne({_id: req.params.id, postBy: commFunc.reqSessionUserId(req)}).exec(function (err, post) {
				if (err) return res.json(err);
				var event=commFunc.removeInvalidKeys(req.body,['albumId', 'imageIds', 'title',
															   'description', 'fromDate', 'toDate', 'where', 'banner']);
				Event.findOneAndUpdate({_id: post.eventId}, event, function (err, NumberUpdated, raw) {
					if (err) return res.json(err);
					Post.populate(post, 'eventId general testimony', function (err, post) {
						if (err) return res.json(err);
						return postFollowByImageUpdate(req,res,post);
					});
				});
			});
		}
	}
};

// Round 1
exports.removePost = function (req, res) {

	Post.where().findOneAndRemove({_id: req.params.id, postBy: commFunc.reqSessionUserId(req)}, function (err) {
		if (err) return res.json(err);
		return res.json({status: req.params.id + "removed successfully."});
	});
};

/*---Comment related-----*/
exports.addCommentToPost = function (req, res) {
	Post.findById(req.params.post_id).exec(function (err, post) {
		if (err) return res.json(err);

		if (!commFunc.isGroupMember(post.postUnderGroupType.toString(), req.user, post.postUnderGroupId.toString())) {
			return res.json({status: "fail", message: "you are not allowed to create post on this wall which you're not a member of."});
		}
		commentObj = req.body;
		errors = commFunc.checkRequiredFields(commentObj, ['comment']);
		if (errors > 0) return res.json(errors);
		commentObj = {
			userId: commFunc.reqSessionUserId(req),
			comment: html_strip.html_strip(commentObj.comment, commFunc.htmlStripOptions),
			profileImg: req.user.profileImg,
			firstName: req.user.firstName,
			lastName: req.user.lastName
		};
		post.comments.push(commentObj);
		return savePost(post, res);
	});
};

exports.updateCommentFromPost = function (req, res) {
	Post.findById(req.params.post_id).exec(function (err, post) {
		if (err) return res.json(err);
		commentObj = req.body;
		errors = commFunc.checkRequiredFields(commentObj, ['comment']);
		if (errors > 0) return res.json(errors);

		if (!commFunc.isGroupMember(post.postUnderGroupType.toString(), req.user, post.postUnderGroupId.toString())) {
			return res.json({status: "fail", message: "you are not allowed to create post on this wall which you're not a member of."});
		}
		var comment = post.comments.id(req.params.comment_id);
		if (comment.userId.toString() === commFunc.reqSessionUserId(req).toString()) {
			commentObj = req.body;
			comment.comment = html_strip.html_strip(commentObj.comment, commFunc.htmlStripOptions);
			comment.updatedOn = new Date();
		} else {
			return res.json({status: "you are not allowed to modify the comment of not yours."});
		}
		return savePost(post, res);
	});
};

exports.deleteCommentFromPost = function (req, res) {
	Post.findById(req.params.post_id).exec(function (err, post) {
		var comment = post.comments.id(req.params.comment_id);
		if (comment.userId.toString() === commFunc.reqSessionUserId(req).toString()) {
			comment.remove();
		} else {
			return res.json({status: "you are not allowed to remove the comment of not yours."});
		}
		return savePost(post, res);
	});
};
