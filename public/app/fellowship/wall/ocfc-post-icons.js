//6.26.2014, create directive for post icons
angular.module('app').directive('ocfcPostIcons', function () {
	return{
		restrict: 'E',
		$scope: true,
		templateUrl: '/partials/fellowship/wall/ocfc-post-icons',
		controller: function () {
		}
	};
});