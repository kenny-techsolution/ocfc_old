angular.module('app').service('SetupSvc', function ($http, IdentitySvc) {
	return{
		init: function (initObj) {
//            console.log("test IdentitySvc.currentUser");
			if (IdentitySvc.currentUser) {
				var params = {
					url: '/api/init',
					method: 'GET',
					params: {userId: IdentitySvc.currentUser._id}
				};
				$http(params).success(function (data) {
//                    console.log("Display data from SetupSvc");
//                    console.log(data);
					initObj.myFellowships = data.myFellowships;
				});
			}
		}
	}

});
