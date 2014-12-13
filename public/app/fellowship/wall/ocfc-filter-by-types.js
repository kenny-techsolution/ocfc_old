//6.26.2014, create directive for filter by types
angular.module('app').directive('ocfcFilterByTypes', function () {
	return{
		restrict: 'E',
		templateUrl: '/partials/fellowship/wall/ocfc-filter-by-types',
		$scope: true,
		controller: function () {
		}
	};
});