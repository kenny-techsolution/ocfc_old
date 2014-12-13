/*************************************************************************************
11.18.2014 re-create Album model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var albumSchema = mongoose.Schema({
	name:		 {type: String, Required:'(name) is required!', index: true, unique: false, lowercase: true},
	createdBy:	 {type: ObjectId, ref:'User', Required:'(createdBy) is required!',index: true, unique: false},
	createdOn:	 {type: Date, Required:'(createdOn) is required!', index: true, unique: false,lowercase: true,default:Date.now},
	imageIds:	 [{type: ObjectId, ref:'Image', index: true, unique: true}],
	description: {type: String, index: true, unique: false,lowercase: true}
});

var Album = mongoose.model('Album', albumSchema);