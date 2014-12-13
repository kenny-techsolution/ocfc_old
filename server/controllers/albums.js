var Album = require('mongoose').model('Album'),
	Image = require('mongoose').model('Image'),
	Fellowship = require('mongoose').model('Fellowship'),
	FellowshipUser = require('mongoose').model('FellowshipUser'),
	deleteKey = require('key-del'),
	commFunc = require('../utilities/commonFunctions'),
	_=require('lodash');//Library for Array


//Post - Round1
exports.createAlbum = function (req, res) {
	var album = req.body;
	album={
		name:album.name,
		createdOn:new Date(),
		createdBy:req.user.id
	}
	var album = new Album(album);
	album.save(function (err,album) {
		if (err) return res.json(err);
		return res.json({status: "success", album: album})
	})
};
//Get - Round1
exports.getAlbum= function (req, res) {
	//Album id must associate to your fellowship
	//match by album id against fellowship
	//grab fellowship_id, chk against fellowshipUser and chk if it matches session user's fellowship_id
	Album.findOne({_id:req.params.id}).exec(function(err,album){
		if (err) return res.json(err);
		Fellowship.find({}).where('albumIds',{$elemMatch:{$in: [album._id]}}).exec(function(err,fellowship) {
			if (err) return res.json(err);
			FellowshipUser.findOne({fellowshipId:req.params.fellowship_id,userId:commFunc.reqSessionUserId(req)}).exec(function(err,fellowshipUser){
				if (err) return res.json(err);
				return res.json({status:"success",album:album});
			})
		});
	})
};

//Put - Round1
exports.updateAlbum= function (req, res) {
	var album = commFunc.removeInvalidKeys(req.body,['name','description']);
	Album.update({ _id:req.params.id }, album, { multi: true }, function (err, numberAffected, raw) {
		if (err) return res.json(err);
		return res.json({status:"success",raw:raw});
	});
};

//Delete - Round1
exports.deleteAlbum= function (req, res) {
	Album.findOneAndRemove({createdBy:commFunc.reqSessionUserId(req),_id:req.params.id}, function (err) {
		if (err) return res.json(err);
		return res.json({status: "successfully removed from Album"});
	});
};

//Post - Round1
exports.createImage= function (req, res) {
	//grab album path from Cloudinary
	var path=req.body.path;
	var image=new Image();
	image.path=path;

	//TODO make sure user can post to this album
	image.save(function(err){
		if (err) return res.json(err);
		Album.findById(req.params.album_id).exec(function(err, album){
			album.imageIds.push(image._id);
			album.save(function(err){
				if (err) return res.json(err);
				return res.json({status:'success',album:album})
			});
		});
	});
};
//Get - Round1
exports.queryImages= function (req, res) {
	var validKeys=commFunc.removeInvalidKeys(req.query,['name','description']);
	Album.find(validKeys).exec(function (err, queryAlbumImgs) {
		if (err) return res.json(err);
		return res.json({status:"success",queryAlbumImgs: _.pluck(queryAlbumImgs,'imageIds')});
	});
};
