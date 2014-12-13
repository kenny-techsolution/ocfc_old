/*******************************************************************************
 ******************************************************************************/
angular.module('app').controller('FellowshipCtrl', function ($fileUploader, $http, $scope,
                                                             IdentitySvc, FellowshipSvc, $routeParams,
                                                             PostSvc, EventSvc,TransformSvc, mySocket, $timeout) {

	//TODO: image uploading functionality.

	var uploader = $scope.uploader = $fileUploader.create({
		scope: $scope,
		url: '/file-upload',
		formData: $scope.formData
	});
	uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
		var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
		type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
		return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	});

	$scope.uploadFile = function () {

	};

	$scope.addPhoto = function () {
		$("input.upload-image").click();
	};

	/******************************** Socket IO ********************************/
		//calling mySocket.on to the server
	mySocket.on('routesSocket', function (data) {
		console.log(data);
		var emittedPost = new PostSvc(data.post);
		$scope.posts.unshift(emittedPost);
	});

	/*************************** initialize variables here ********************/
	$scope.formData = {};
	$scope.loading = true;
	$scope.photoUploaded = false;
	$scope.postsLoaded=false;
//	$scope.currVisibility;
//	$scope.imagePath;

	/***** Visibility variables *****/
	$scope.visiObj = {
		visibilityOptions: [
			{ id: 1, name: 'Public' },
			{ id: 2, name: 'Church' },
			{ id: 3, name: 'World' }
		],
		visibility: {
			fellowship: true,
			church: false,
			world: false
		}
	};

	/***** Fellowship variables *****/
	$scope.fellowObj = {
		about: '',
		name: '',
		id: ''
	};

	var fellow = FellowshipSvc.get(
		{
			_id: $routeParams.id}
		//below parameter is a callback, 1st parameter must be met
		, function () {
			$scope.fellowObj.about = fellow.about;
			$scope.fellowObj.name = fellow.name;
			$scope.fellowObj.id = fellow._id;
		}
	);

	/*****General Post Variables *****/
	$scope.postObj = {
		testimonyPost: {
			type: 0,
			content: '',
			title:'',
			placeholder:"Share your testimony"
		},
		questionPost: {
			type: 1,
			content: '',
			placeholder:"What is your question?"
		},
		generalPost: {
			type: 2,
			content: '',
			placeholder:"What's on your mind?"
		},
		eventPost: {
			event:'create ObjectId here',
			from_date:new Date(1999,05,22),
			from_date_time:new Date(),
			to_date:new Date(2999,05,22),
			to_date_time:new Date(),
			where:'CCIC',
			welcome:'Newcomber',
			type: 3,
			title: 'title is Hi',
			content: 'this is boday of content',
			placeholder:"What event to plan?"
		},
		fellow_object_id: $routeParams.id,
		content:'',
		visibility: '',
		postBy: '',
		postDate: '',
		isPostShown: false,
		postType:'general',
		type: 2,
		placeholder: '',
		placeHolderStrs: [
			"Share your testimony",
			"What is your question?",
			"What's on your mind?",
			"What event to plan?"],
		title:''
	};

//	$scope.onClickType = function (type) {
//		//Set $scope.post.type to integer value (0=testimony,1=question,2=general,3=event)
//		$scope.postObj.type = TransformSvc.toPostTypeInt(type);
//
//		//Set $scope.placeholder to the appropriate $scope.placeHolderStrs string
//		// using $scope.post.type value as index
//		$scope.postObj.placeholder = $scope.postObj.placeHolderStrs[$scope.postObj.type];
//	};
//

//	//5.24.2014 method that transform Type values to string
//	//Set $scope.transformType to either testimony, question or general string
//	//by using type value as index
//	$scope.postObj.transformType = TransformSvc.toPostTypeStr($scope.postObj.type);

	//6.26.2014 created displayPost function
	//Call $scope.displayPost function when
	// $scope.isPostShown equates False
	$scope.displayPost = function () {
		//assigning to opposite
		$scope.postObj.isPostShown = !$scope.postObj.isPostShown;
	};

	$scope.createPost = function (e, type) {
		//Default preventDefault() event action will not be triggered.
		e.preventDefault();
		$scope.postObj.type = type;
		//$scope.postType is an inline function created on ocfc-wall-category
		$scope.postObj.postType=$scope.postType;
		//Set $scope.post.visibility variable to an array that captures fellow_object_id
		$scope.postObj.visibility = [$scope.postObj.fellow_object_id];
		//Set $scope.post.postDate to current date
		$scope.postObj.postDate = new Date();
		//Set $scope.post.fellow_object_id as itself
		$scope.postObj.fellow_object_id = $scope.postObj.fellow_object_id;
		//Set $scope.post.postBy to currentUser id
		$scope.postObj.postBy = IdentitySvc.currentUser._id;

		//11.4.2014 Set post content entries
		switch ($scope.postObj.type) {
			case 0: //testimony
				$scope.postObj.testimonyPost.content = $scope.postObj.content;
				$scope.postObj.testimonyPost.title=$scope.postObj.title;

				break;
			case 1: //question
				$scope.postObj.questionPost.content = $scope.postObj.content;

				break;
			case 2: //general
				$scope.postObj.generalPost.content = $scope.postObj.content;

				break;
			case 3: //event
				$scope.postObj.eventPost.content = $scope.postObj.content;
				$scope.postObj.eventPost.title=$scope.postObj.title;

				break;
			default:
				$scope.postObj.generalPost.content = $scope.postObj.content;
		};

		//Resource object allows $scope.post as parameter
		var newPost = new PostSvc($scope.postObj);
		console.log('chk newPost which is an instance of PostSvc');
		console.log(newPost);

		if ($scope.postObj.type==3){
			var newEvent=new EventSvc($scope.postObj.eventPost);
			newEvent.$save().then(function(data){
				newPost.event=data._id;
				savePost(newPost);
				console.log('New post results');
				console.log(newPost);
			});

		}else {
			savePost(newPost);
		}

	};

	var savePost = function(newpost){
		//standard Rest API call
		newpost.$save().then(function (data) {
				//The unshift() method adds one or more elements
				// to the beginning of $scope.posts array and
				// returns the new length of the array.
				$scope.posts.unshift(newpost);
			}, function (reason) {
			}
		);
	};
	//5.24.2014, query all posts made within a fellowship
	$scope.posts = PostSvc.query({
		fellow_object_id: $scope.postObj.fellow_object_id  //where clause
	}, function () {
		$timeout(function(){
			$scope.postsLoaded=true;
		},500);


	});

	//5.26.2014 update Post by adding on comment
	$scope.addComment = function (id, comment) {
		PostSvc.update({
			_id: id  //where clause
		}, {comments: comment}, function () {

		});
	};

});

