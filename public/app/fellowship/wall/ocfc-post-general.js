/**
 * Created by haojenchung on 11/4/14.
 */
angular.module('app').directive('ocfcPostGeneral', function () {
	return{
		restrict: 'E',
		$scope: {
			post: "="
		},
		templateUrl: '/partials/fellowship/wall/ocfc-post-general',
		controller: function ($scope) {

		}
	};
});