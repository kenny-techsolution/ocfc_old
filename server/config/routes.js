/*******************************************************************************
 * Routes are required to connect to the server
 *
 * Mapping:
 *
 * GET -> $HTTP GET QUERY -> $HTTP GET UPDATE -> $HTTP PUT (REQ BODY permitted)
 * REMOVE -> $HTTP DELETE ADD -> $HTTP POST (REQ BODY permitted)
 ******************************************************************************/

var albums = require('../controllers/albums'),
	calendars = require('../controllers/calendars'),
	churches = require('../controllers/churches');
	events = require('../controllers/events'),
	fellowships = require('../controllers/fellowships'),
	files = require('../controllers/files'),
	folders = require('../controllers/folders'),
	images = require('../controllers/images'),
	inits = require('../controllers/inits'),
	inviteOtherToFellowship = require('../controllers/inviteOtherToFellowship'),
	posts = require('../controllers/posts'),
	stats = require('../controllers/stats'),
	users = require('../controllers/users'),

	/*--Others--*/
	auth = require('./auth'),
	eventsOld = require('../controllers/events-old'),
	cloudinary = require('cloudinary');


module.exports = function (app, io) {
	/* ------ Socket IO setup -------- */
	var ioSocket;
	io.on('connection', function (socket) {
		ioSocket = socket;
		ioSocket.emit('testSocket', {result: "Socket test complete"});
	});

	/* ------ User related API -------- */
	app.post('/api/users', users.createUser);
	app.put('/api/users', users.updateUser);
	app.get('/api/users/:id', users.getUserById);
	app.delete('/api/users', users.deleteUser);
	app.put('/api/users/update_profile_image', users.updateProfileImage);
	app.get('/api/users/:id/reset_password', users.resetPassword);
	app.put('/api/eventParticipation/:event_id', users.updateEventParticipation);

	/* ------ Fellowship related API -------- */
	app.post('/api/fellowships', fellowships.createFellowship);
	app.put('/api/fellowships/:id', fellowships.updateFellowshipById);
	app.get('/api/fellowships/:id', fellowships.getFellowshipById);
	app.delete('/api/fellowships/:id', fellowships.deleteFellowshipById);

	app.post('/api/fellowships/:fellowship_id/users', fellowships.addUserToFellowship);
	app.get('/api/fellowships/:fellowship_id/users', fellowships.getUsersFromFellowship);
	app.put('/api/fellowships/:fellowship_id/users/:user_id', fellowships.updateUserToFellowship);
	app.delete('/api/fellowships/:fellowship_id/users/:user_id', fellowships.removeUserFromFellowship);

	/* ------ Invite Other To Fellowships related API -------- */
	app.post('/api/inviteOtherToFellowships/:fellowship_id', inviteOtherToFellowship.createInvite);
	app.get('/api/inviteOtherToFellowships', inviteOtherToFellowship.queryInvites);
	app.get('/api/inviteOtherToFellowships/:id', inviteOtherToFellowship.getInvite);
	app.delete('/api/inviteOtherToFellowships/:id', inviteOtherToFellowship.deleteInvite);

	/* ------ Church related API -------- */
	app.post('/api/churches', churches.createChurch);
	app.put('/api/churches/:id', churches.updateChurchById);
	app.get('/api/churches/:id', churches.getChurchById);
	app.get('/api/churches', churches.queryChurches);
	app.delete('/api/churches/:id', churches.deleteChurchById);

	app.post('/api/churches/:church_id/fellowships/:fellowship_id', churches.addFellowshipToChurch );
	app.put('/api/churches/:church_id/fellowships/:fellowship_id', churches.updateFellowshipToChurch);
	app.get('/api/churches/:church_id/fellowships', churches.getFellowships);
	app.delete('/api/churches/:church_id/fellowships/:fellowship_id', churches.removeFellowshipFromChurch);

	app.post('/api/churches/:church_id/users/:user_id', churches.addUserToChurch);
	app.put('/api/churches/:church_id/users/:user_id', churches.updateUserToChurch);
	app.get('/api/churches/:church_id/users', churches.getUsers);
	app.delete('/api/churches/:church_id/users/:user_id', churches.removeUserFromChurch);

	/* ------ Post related API -------- */
	app.post('/app/posts', posts.createPost);// put Socket IO emit.
	app.get('/app/posts/:id', posts.getPost);
	app.get('/app/posts', posts.queryPost);
	app.put('/app/posts/:id', posts.updatePost);
	app.delete('/app/posts/:id', posts.removePost);

	app.post('/app/posts/:post_id/comments', posts.addCommentToPost);
	app.put('/app/posts/:post_id/comments/:comment_id', posts.updateCommentFromPost);
	app.delete('/app/posts/:post_id/comments/:comment_id', posts.deleteCommentFromPost);

	/* ------ Calendar related API -------- */
	app.post('/api/calendars', calendars.createCalendar);
	app.get('/api/calendars/:id', calendars.getCalendar);
	app.get('/api/calendars', calendars.queryCalendars);
	app.put('/api/calendars/:id', calendars.updateCalendar);
	app.delete('/api/calendars/:id', calendars.deleteCalendar);

	app.post('/api/calendars/:calendar_id/events', calendars.createEventToCalendar);
	app.get('/api/calendars/:calendar_id/events', calendars.queryEventsFromCalendar);
	app.get('/api/events/:event_id', events.getEvent);
	app.put('/api/events/:event_id', events.updateEvent);
	app.delete('/api/events/:event_id', events.deleteEvent);

	app.post('/api/events/:event_id/comments', events.addCommentToEvent);
	app.put('/api/events/:event_id/comments/:comment_id', events.updateCommentFromEvent);
	app.delete('/api/events/:event_id/comments/:comment_id', events.deleteCommentFromEvent);
	//add invitee crud functions.


	/* ------ Album related API -------- */
	app.post('/api/albums', albums.createAlbum);
	app.get('/api/albums/:id', albums.getAlbum);
	app.put('/api/albums/:id', albums.updateAlbum);
	app.delete('/api/albums/:id', albums.deleteAlbum);

	app.post('/api/albums/:album_id/images', albums.createImage);
	app.get('/api/albums/:album_id/images', albums.queryImages);
	app.get('/api/images/:image_id', images.getImage);
	app.put('/api/images/:image_id', images.updateImage);
	app.delete('/api/images/:image_id', images.deleteImage);

	app.post('/api/images/:image_id/comments', images.addCommentToImage);
	app.put('/api/images/:image_id/comments/:comment_id', images.updateCommentFromImage);
	app.delete('/api/images/:image_id/comments/:comment_id', images.deleteCommentFromImage);

	/* ------ Folder related API -------- */
	app.post('/api/folders', folders.createFolder);
	app.get('/api/folders/:id', folders.getFolder);
	app.get('/api/folders', folders.queryFolders);
	app.put('/api/folders/:id', folders.updateFolder);
	app.delete('/api/folders/:id', folders.deleteFolder);

	app.post('/api/folders/:folder_id/files', folders.createFile);
	app.get('/api/folders/:folder_id', folders.queryFiles);
	app.get('/api/files/:file_id', files.getFile);
	app.put('/api/files/:file_id', files.updateFile);
	app.delete('/api/files/:file_id', files.deleteFile);

	app.post('/api/files/:file_id/comments', files.addCommentToFile);
	app.put('/api/files/:file_id/comments/:comment_id', files.updateCommentFromFile);
	app.delete('/api/files/:file_id/comments/:comment_id', files.deleteCommentFromFile);

	/*------Init, Stat----- */
	app.get('/api/inits',inits.getInit);
	/* ------ Traffic data API -------- */
	app.get('/api/stats',stats.getStats);

	/*------Cloudinary Image Signing------ */
	app.get('/cloudinarySigned', function(req, res){
		var params = cloudinary.utils.sign_request({
			timestamp: cloudinary.utils.timestamp(),
			transformation: "c_limit,h_40,w_40",
			format: "jpg"
			},
			{
				api_key: "399137143626587",
				api_secret: "royt6Nw2fVrbRtdwT_mjmDP7CkE"
			});
		res.json(params);
	});

	// -----------------------------------------------------------------------------
/*
 * LEGACY CODE //4.29.2014, retrieve data from fellows controller
 * app.get('/api/fellows',fellows.getFellows);
 * app.get('/api/fellows/:id',fellows.getFellow); //5.14.2015, create new
 * fellowship by Admin app.post('/api/fellows',fellows.createFellow);
 * app.put('/api/fellows/:id',fellows.updateFellow);
 *
 * //4.30.2014 equalvilant to add, create route for handling user joining
 * fellowship app.post('/api/fellowUsers',fellowUsers.createFellowUser);
 *
 * app.get('/api/fellowUsers',fellowUsers.queryFellowUser);
 * app.get('/api/fellowUsers/:id',fellowUsers.getFellowUser);
 * app.delete('/api/fellowUsers/:id',fellowUsers.removeFellowUser);
 *
 * //equalvilant to update
 * app.put('/api/fellowUsers/:id',fellowUsers.updateFellowUser);
 *
 * //5.24.2014 create post api app.post('/api/posts',posts.createPost,
 * function(req, res, next){ io.sockets.emit('routesSocket',res.$_emitBody);
 * res.send(res.$_emitBody); }); app.get('/api/posts',posts.queryPost);
 *
 * app.get('/api/init',init.getInit);
 */
	// Define a new route for Jade
	app.get('/partials/*', function(req, res){
		res.render('../../public/app/'+req.params);
	});

	// middleware will authenticate user
	app.post('/login',auth.authenticate);

	app.post('/logout',function(req,res){
		req.logout();
		res.end();
	});

	app.all('/api/',function(req,res){
		res.send(404);
	});

	app.get('*',function(req,res){
		res.render('index',{
			bootstrappedUser: req.user
		});
	});
};
