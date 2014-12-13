/**
 * Created by haojenchung on 11/4/14.
 */
angular.module('app').directive('ocfcPostQuestion', function () {
	return{
		restrict: 'E',
		$scope: {
			post: "="
		},
		templateUrl: '/partials/fellowship/wall/ocfc-post-question',
		controller: function ($scope) {

		}
	};
});