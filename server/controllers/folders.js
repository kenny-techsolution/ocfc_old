var Folder = require('mongoose').model('Folder'),
	File = require('mongoose').model('File'),
	mongoose = require('mongoose'),
	deleteKey = require('key-del'),
	commFunc = require('../utilities/commonFunctions'),
	deleteKey = require('key-del'),
	_=require('lodash');//Library for Array


//Post - Round1
exports.createFolder=function (req, res) {
	var folder = req.body;
	folder.name=folder.name;
	folder.description=folder.description;

	var folder = new Folder(folder);
	folder.save(function (err) {
		if (err) return res.json(err);
		return res.json({status:"success",folder:folder});
	})
};
//Get - Round1
exports.getFolder=function (req, res) {
	Folder.findOne({_id:req.params.id}).exec(function(err,folder){
		if (err) return res.json(err);
		return res.json({status:"success",folder:folder});
	});
};
//Get - Round1
exports.queryFolders=function (req, res) {
	var validKeys=commFunc.removeInvalidKeys(req.query,['name','description']);
	Folder.find(validKeys).exec(function (err, queryFolders) {
		if (err) return res.json(err);
		return res.json({status:"success",queryFolders:queryFolders});
	});
};
//Put - Round1
exports.updateFolder=function (req, res) {
	var folder=commFunc.removeInvalidKeys(req.query,['name','description']);
	Folder.update({_id:req.params.id }, folder, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};
//Delete - Round1
exports.deleteFolder=function (req, res) {
	Folder.findOneAndRemove({createdBy:req.user._id,_id:req.params.id},function (err) {
		if (err) {
			err = commFunc.handleError(err);
			return res.json(err);
		}
		return res.json({status: "successfully removed from Album"});
	});
};

//Post - Round1
exports.createFile=function (req, res) {
	var path=req.body.path;

	var file=new File();
	file.path=path;
	file.name=req.body.name;

	//TODO make sure user can post to this album
	file.save(function(err){
		if(err) return res.json(err);

		Folder.findById(req.params.folder_id).exec(function(err, folder){
			if(err) return res.json(err);
			folder.fileIds.push(file._id);
			folder.save(function(err){
				if(err)return res.json(err);
				return res.json({status:'success',file:file})
			});
		});
	});
};

//Get - Round1
exports.queryFiles=function (req, res) {
	var validKeys=commFunc.removeInvalidKeys(req.query,['path']);
	Folder.find(validKeys).exec(function (err, queryFolderFiles) {
		if (err) return res.json(err);
		return res.json({status:"success",queryFolderFiles: _.pluck(queryFolderFiles,'fileIds')});
	});
};