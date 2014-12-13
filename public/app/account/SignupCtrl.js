/*************************************************************************************
 This file creates a new Controller called SignupCtrl
 which takes $scope, UserSvc.js, NotifierSvc,$location,AuthSvc.js
 directives

 newUserData object is created containing username, password, firstName and LastName

 Checks data against AuthSvc.js to insure data is correct
 *************** ************************************************************************/


angular.module('app').controller('SignupCtrl', function ($scope, UserSvc, NotifierSvc, $location, AuthSvc) {
	$scope.bdateReason = NotifierSvc.notify('Click for more information');

	$scope.signup = function () {
		var newUserData = {
			firstName: $scope.fname,
			lastName: $scope.lname,
			userName: $scope.email,
			password: $scope.password,
			birthday: {month: $scope.month,
				day: $scope.day,
				year: $scope.year},
			gender: $scope.gender
		};

		//newUser creates new instance of UserSvc service resource object
		//it then gets saved & data is passed into IdentitySvc.currentUser
		AuthSvc.createUser(newUserData).then(function () {
				console.log('test newUserData dataset for signup');
				console.log(newUserData);
				NotifierSvc.notify('User account created!');
				$location.path('/');
			}
			, function (reason) {
				NotifierSvc.error(reason);
			})
	}
});