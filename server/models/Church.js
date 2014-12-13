/*************************************************************************************
11.18.2014 re-create Fellow model as per latest requirement
 ***************************************************************************************/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

//add funded on.
var churchSchema = mongoose.Schema({
	approved:   	{type: Boolean, index: true, unique: false, default: false},
	name:			{type: String,required:'(name) is required!',index: true, unique: false,lowercase: true},
	about:			{type: String,index: false, unique: false,lowercase: true},
	url:			{type: String,index: false, unique: false,lowercase: true},
	address:		{type: String,required:'(address) is required!',index: true, unique: false,lowercase: true},
	city:			{type: String,required:'(city) is required!',index: true, unique: false,lowercase: true},
	country:		{type: String,required:'(country) is required!',index: true, unique: false,lowercase: true},
	zipcode:		{type: String,required:'(zipcode) is required!',index: true, unique: false,lowercase: true},
	phone:			{type: String,required:'(phone) is required!',index: false, unique: false,lowercase: true},
	fax:			{type: String,index: false, unique: false},
	faithStatement:	{type: String,required:'(faithStatement) is required!',index: false, unique: false,lowercase: true},
	mission:		{type: String,required:'(mission) is required!',index: false, unique: false,lowercase: true},
	vision:			{type: String,required:'(vision) is required!',index: false, unique: false,lowercase: true},
	startDate: 	    {type: Date, required: '(startDate) is required!', index: false, unique: false,lowercase: true,default: Date.now},
	updateDate: 	{type: Date, required: '(updateDate) is required!', index: false, unique: false,lowercase: true,default: Date.now},
	active:         {type:Boolean,required: '(active) is required!',default:true}
});

var Church = mongoose.model('Church', churchSchema);
function createDefaultChurches() {
	Church.find({}).exec(function (err, collection) {
		if (collection.length === 0) {
			Church.create({name: 'CCIC Mountian View', address:'920 sierra vista ave', city:'Mountain View', country:'United States', zipcode: '12456',
						phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
						mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
						vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCIC Cupertino', address:'920 sierra vista ave', city:'Cupertino', country:'United States', zipcode: '12456',
							phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
							mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
							vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCIC Palo Alto', address:'920 sierra vista ave', city:'Palo Alto', country:'United States', zipcode: '12456',
							phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
							mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
							vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCCC Columbus', address:'920 sierra vista ave', city:'Columbus', country:'United States', zipcode: '12456',
								phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
								mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
								vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCIC Sunnyvale', address:'920 sierra vista ave', city:'Sunnyvale', country:'United States', zipcode: '12456',
							phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
							mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
							vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCIC Redwood City', address:'920 sierra vista ave', city:'Redwood City', country:'United States', zipcode: '12456',
							phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
							mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
							vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});
			Church.create({name: 'CCIC Millbrae', address:'920 sierra vista ave', city:'Millbrae', country:'United States', zipcode: '12456',
							phone: '111-2222-3333', faithStatement:'一、聖經: 我們相信神藉著聖經向人類啟示祂自己。聖經是神所默示、是被聖靈感動的人所寫作的，聖經的原始手稿完全無誤，而且聖經是所有人在信心與行為上不朽的至高權柄。',
							mission:'傳福音「…你們要去，使萬民做我的門徒，奉父、子、聖靈的名，給他們施洗，凡我所吩咐你們的，都教訓他們遵守…」（太28:19/20',
							vision:'基督徒會堂確認其事工之目的在裝備信徒，使具備：堅固的聖經基礎；多方面的造就與生命上的栽培；並向本地及普世廣傳福音。每一位信徒均積極參與此行列，使教會能活潑增長。'});

		}
	});
}

exports.createDefaultChurches = createDefaultChurches;
