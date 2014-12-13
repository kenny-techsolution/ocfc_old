//6.26.2014, create directive of user comment input
angular.module('app').directive('ocfcUserCommentInput', function () {
	return{
		restrict: 'E',
		$scope: true,
		templateUrl: '/partials/fellowship/wall/ocfc-user-comment-input',
		controller: function () {
		}
	};
});