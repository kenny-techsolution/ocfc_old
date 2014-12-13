/*************************************************************************************
 11.18.2014 re-create ChurchFellow model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var churchFellowshipSchema = mongoose.Schema({
	churchId:	{type: ObjectId, ref:'Church', required:'(churchId) is required!', index: true, unique: false,lowercase: true},
	fellowshipId:	{type: ObjectId, ref:'Fellowship', required:'(FellowshipId) is required!', index: true, unique: false,lowercase: true},
	updateDate:	{type: Date, required:'(updateDate) is required!', index: true, unique: false,lowercase: true, default: Date.now},
	rejReason:	{type: String, index: true, unique: false},
	status:		{type: String, required:'(status) is required!', index: true, unique: false,lowercase: true}
});

var ChurchFellowship = mongoose.model('ChurchFellowship', churchFellowshipSchema);
function createDefaultChurchFellows() {
	ChurchFellowship.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'01/01/2014',status:'Approved'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'02/01/2014',status:'Approved'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'03/01/2014',status:'Pending'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'04/01/2014',status:'Pending'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'05/01/2014',status:'None'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'06/01/2014',status:'None'});
//			ChurchFellow.create({churchId:{}, fellowId:{}, updateDate:'07/01/2014',status:'Approved'});
		}
	});
}

exports.createDefaultChurchFellows = createDefaultChurchFellows;
