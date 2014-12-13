//6.26.2014, create directive for view permission
angular.module('app').directive('ocfcViewPermission', function () {
	return{
		restrict: 'E',
		$scope: true,
		templateUrl: '/partials/common/ocfc-view-permission',
		controller: function ($scope) {
			$scope.fellowshipVisiMenu = false;
		}
	};
});