/*************************************************************************************
 Common controller, always required
 ***************************************************************************************/

angular.module('app').controller('CommonCtrl', function ($scope, SetupSvc, IdentitySvc) {

	$scope.initObj = {};
	$scope.initObj.myFellowships;
	SetupSvc.init($scope.initObj);
	$scope.identity = IdentitySvc;

});