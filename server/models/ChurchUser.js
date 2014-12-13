/*************************************************************************************
 11.18.2014 re-create ChurchUser model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var churchUserSchema = mongoose.Schema({
	churchId:	{type: ObjectId, ref:'Church', Required:'(churchId) is required!',index: true, unique: false},
	userId:		{type: ObjectId, ref:'User', Required:'(userId) is required!',index: true, unique: false},
	updateDate:	{type: String, Required:'(updateDate) is required!',index: true, unique: false,default:Date.now},
	rejReason:	{type: String, index: true, unique: false},
	status:		{type: String, Required:'(status) is required!',index: true, unique: false,lowercase: true},
	role:		{type: String, required:'(role) is required!', index: true, unique: false,lowercase: true}
});

var ChurchUser = mongoose.model('ChurchUser', churchUserSchema);
function createDefaultChurchUsers() {
	ChurchUser.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'Approved'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'Approved'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'Pending'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'Pending'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'None'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'None'});
//			ChurchUser.create({churchId:{}, userId:{}, updateDate:new Date(2013, 2, 1),status:'Approved'});
		}
	});
}

exports.createDefaultChurchUsers = createDefaultChurchUsers;
