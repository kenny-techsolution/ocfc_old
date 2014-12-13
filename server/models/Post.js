/*************************************************************************************
11.18.2014 re-create Post model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var commentSchema=require('./Comment').commentSchema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var testimonySchema = mongoose.Schema({
	title:{type: String, Required:'(title) is required!',index: false, unique: false,lowercase: true},
	content: {type: String, Required:'(story) is required!',index: false, unique: false,lowercase: true}
});

var generalSchema = mongoose.Schema({
	content:{type: String, Required:'(title) is required!',index: false, unique: false,lowercase: true}
});

var postSchema = mongoose.Schema({
	postUnderGroupId: {type: ObjectId, Required:'(postUnderGroupId) is required!'},
	postUnderGroupType: {type: String, Required:'(postUnderGroupType) is required!'},
	shareTo: [
		{
			groupId: {type: ObjectId, Required:'(groupId) in shareTo, is required!', index: true},
			groupType: {type: String, Required:'(grouptype) in shareTo, is required!'},
			status: {type: String, equired:'(status) in statuså, is required!'}
		}
	],
	testimony:		[testimonySchema], //mongoose only allows array for subDocument to be included.
	general:		[generalSchema],
	question:		{type: String, index: false, unique: false},
	prayer:			{type: String, index: false, unique: false},
	eventId:		{type: ObjectId, ref:'Event', index: false, unique: false},
	imageIds:		[{type: ObjectId ,ref:'Image',index: false, unique: false,lowercase: true}],
	postBy:			{type: ObjectId, ref:'User', Required:'(postBy), is required!', index: true, unique: false},
	postType:		{type: Number, Required:'(postType), is required!', index: true, unique: false, get: postTypeGetter, set:postTypeSetter},
	comments:		[commentSchema],
	createdOn:		{type: Date, index: true, unique: false, default: Date.now},
	updatedOn:		{type: Date,index: true, unique: false, default: Date.now}
});

var postTypeArray = ['general','testimony','question','prayer','event'];

function postTypeGetter (postType) {
	console.log("post type");
	console.log(postType);
	console.log(postTypeArray);
	return postTypeArray[postType];
}
function postTypeSetter(val) {
	val.toLowerCase();
	return postTypeArray.indexOf(val);
}

var Post = mongoose.model('Post', postSchema);
