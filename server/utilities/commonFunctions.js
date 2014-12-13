/*************************************************************************************
This file creates a new utility called commonFunction.js which will store commonly
used functions
 ***************************************************************************************/
var _=require('lodash'); //Library for Array;

//Common functions are defined below
exports.cl = function (title, value) {
	console.log(title);
	console.log(value);
};

exports.toProperCase = function (str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

exports.toLowerCase=function(obj){
	for (var i in obj) {
		if (i!=="imageIds" || i!=="createdOn"||i!=="profileImg"||i!=="albumIds"
			|| i!=="fileIds" || i!=="calendarIds"){
			console.log(obj[i]);
			obj[i] = obj[i].toLowerCase();
		}
	}
	return obj;
};

//Equates to, userId: req.user._id
exports.reqSessionUserId=function(req){
	return req.user._id
};

exports.removeInvalidKeys = function(obj, validKeyArray){
	var actualKeys = _.keys(obj);
	var filteredKeys = _.intersection(validKeyArray, actualKeys);
	var newObj = {};
	_.forEach(filteredKeys, function(key){
		//Grab value for each key
		//created newObj and insert valid key values onto it
		newObj[key] = obj[key];
	})
	return newObj;

};

exports.updateInstanceWithObject=function(obj,instanceObj){
	for(var key in obj){
		instanceObj.set(key, obj[key]);
	}
	return instanceObj;
};


exports.htmlStripOptions = {
	include_script : false,
	include_style : false
};

exports.isGroupMember = function(groupType, sessionUser, groupId) {
	var groups = sessionUser[groupType + "s"];
	console.log("isGroupMember");
	console.log(groupType);
	console.log(groups);
	console.log(groupId);
	var permissions = [];
	for(var i=0; i< groups.length; i++) {
		if(String(groups[i][groupType + 'Id']) === groupId){
			permissions.push(groups[i]);
		}
	}
	var resultBoolean = (permissions.length == 0)? false: true;
	return resultBoolean;
};

exports.isFellowshipAdmin = function(sessionUser, fellowshipId) {
	var fellowships = sessionUser['fellowships'];
	var permissions = [];
	for(var i=0; i< fellowships.length; i++) {
		if(String(fellowships[i].fellowshipId) === fellowshipId && String(fellowships[i].role) === "admin"){
			permissions.push(fellowships[i]);
		}
	}
	var resultBoolean = (permissions.length == 0)? false: true;
	return resultBoolean;
};

exports.isFellowshipMember = function(sessionUser, fellowshipId) {
	var fellowships = sessionUser['fellowships'];
	var permissions = [];
	for(var i=0; i< fellowships.length; i++) {
		if(String(fellowships[i].fellowshipId) === fellowshipId && (String(fellowships[i].role) === "admin"||String(fellowships[i].role) === "member")){
			permissions.push(fellowships[i]);
		}
	}
	var resultBoolean = (permissions.length == 0)? false: true;
	return resultBoolean;
};

exports.isChurchAdmin = function(sessionUser, churchId) {
	var churches = sessionUser['churches'];
	var permissions = [];
	for(var i=0; i< churches.length; i++) {
		if(String(churches[i].churchId) == String(churchId) && String(churches[i].role) == "admin"){
			permissions.push(churches[i]);
		}
	}
	var resultBoolean = (permissions.length == 0)? false: true;
	return resultBoolean;
};

exports.isChurchMember = function(sessionUser, churchId) {
	var churches = sessionUser['churches'];
	var permissions = [];
	for(var i=0; i< churches.length; i++) {
		if(String(churches[i].churchId) === churchId && (String(churches[i].role) === "admin"||String(church.role) === "member")){
			permissions.push(churches[i]);
		}
	}
	var resultBoolean = (permissions.length == 0)? false: true;
	return resultBoolean;
};

exports.checkRequiredFields = function (obj, fields) {
	var errors = []
	_.forEach(fields, function(key){
		if(!_.has(obj, key)){
			errors.push(key + " is required field.");
		}
	});
	return errors;
};


