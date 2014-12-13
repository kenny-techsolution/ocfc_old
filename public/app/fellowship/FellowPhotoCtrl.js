angular.module('app').controller('FellowPhotoCtrl', function($scope, $rootScope, $routeParams, $upload, $location, $http) {
		$scope.cloudinarySignedParams;
		$http.get("/cloudinarySigned").success(function(data){
			$scope.cloudinarySignedParams = data;
			console.log($scope.cloudinarySignedParams);
//			$.cloudinary.config().timestamp = $scope.cloudinarySignedParams.timestamp;
//			$.cloudinary.config().transformation = $scope.cloudinarySignedParams.transformation;
//			$.cloudinary.config().format = $scope.cloudinarySignedParams.format;
//			$.cloudinary.config().signature = $scope.cloudinarySignedParams.signature;
//			$.cloudinary.config().api_key = $scope.cloudinarySignedParams.api_key;
			console.log($.cloudinary.config());

		});
		$scope.onFileSelect = function($files) {
				var file = $files[0]; // we're not interested in multiple file uploads here
				$scope.upload = $upload.upload({
						url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
						data: $scope.cloudinarySignedParams,
						file: file
				}).progress(function (e) {
						$scope.progress = Math.round((e.loaded * 100.0) / e.total);
						$scope.status = "Uploading... " + $scope.progress + "%";
						//$scope.$apply();
				}).success(function (data, status, headers, config) {
						$rootScope.photos = $rootScope.photos || [];
						data.context = {custom: {photo: $scope.title}};
						$scope.result = data;
						$rootScope.photos.push(data);
						//$scope.$apply();
				});
		};
});