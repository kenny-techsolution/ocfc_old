var Calendar = require('mongoose').model('Calendar'),
	Event = require('mongoose').model('Event'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	_=require('lodash');//Library for Array

//Post - Round1
exports.createCalendar= function (req, res) {
	var calendar = req.body;
	calendar.ownerType=calendar.ownerType;
	calendar.title=calendar.title;
	calendar.createdBy=commFunc.reqSessionUserId(req);
	calendar = new Calendar(calendar);

	calendar.save(function (err) {
		if (err) return res.json(err);
		return res.json({status:"success",calendar:calendar});
	})
};
//Get - Round1
exports.getCalendar= function (req, res) {
	Calendar.findOne({_id:commFunc.reqParamId(req,'id')}).exec(function(err,calendar){
		if (err) return res.json(err);
		return res.json({status:"success",calendar:calendar});
	});
};
//Get - Round1
exports.queryCalendars= function (req, res) {
	var validKeys=commFunc.removeInvalidKeys(req.query,['ownerType','title']);
	Calendar.find(validKeys).exec(function (err, queryCalendar) {
		if (err) return res.json(err);
		return res.json({status:"success",queryCalendar:queryCalendar});
	});
};

//Put - Round1
exports.updateCalendar= function (req, res) {
	var calendar=commFunc.removeInvalidKeys(req.query,['ownerType','title']);
	Calendar.update({ _id:commFunc.reqParamId(req,'id')}, calendar, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};

//Delete - Round1
exports.deleteCalendar= function (req, res) {
	Calendar.findOneAndRemove({createdBy: commFunc.reqSessionUserId(req), _id: commFunc.reqParamId(req,'id')}, function (err) {
		if (err) return res.json(err);
		return res.json({status: "successfully removed from Calendar"});
	});
};

//Post - Round1
exports.createEventToCalendar= function (req, res) {
	var event=req.body;
	event=new Event(event);
	event.fromDate=new Date();
	event.toDate=new Date();
	event.hostBy=commFunc.reqSessionUserId(req);

	//TODO make sure user can post to this album
	event.save(function(err){
		if(err) return res.json(err);

		Calendar.findById(commFunc.reqParamId(req,'calendar_id')).exec(function(err, calendarEvent){
			calendarEvent.eventIds.push(event._id);
			calendarEvent.save(function(err){
				if(err) return res.json(err);
				return res.json({status:'success',calendarEvent:calendarEvent})
			});
		});
	});
};
//Get - Round1
exports.queryEventsFromCalendar= function (req, res) {
	var calendar=commFunc.removeInvalidKeys(req.query,['ownerType','title']);
	Calendar.findById(req.params.calendar_id,calendar).exec(function(err,queryCalendarEvents) {
		if (err) return res.json(err);
		return res.json({status:"success",queryCalendarEvents:queryCalendarEvents});
	});
};
