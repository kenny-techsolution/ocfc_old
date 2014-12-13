/*************************************************************************************
 This file creates a new utility called encryption.js

 createSalt object is created which returns encrypted salt value

 hashPwd object is crated which returns encrypted password value

 ***************************************************************************************/

var crypto = require('crypto');

exports.createSalt = function () {
	return crypto.randomBytes(128).toString('base64');
}

exports.hashPwd = function (salt, pwd) {
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(pwd).digest('hex');
}
