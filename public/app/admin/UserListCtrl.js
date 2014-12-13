/*************************************************************************************
 This file creates a new Controller called UserListCtrl
 which injects $scope, UserSvc.js

 assign $scope.users with User.query()

 UserSvc.query() service:  Inserts data into mongoose database.

 ***************************************************************************************/

angular.module('app').controller('UserListCtrl', function ($scope, UserSvc) {
	//return all fields from UserSvc.query() in mongoose db
	$scope.users = UserSvc.query();
	console.log("Test user role by calling $scope.users");
	console.log($scope.users);
});

