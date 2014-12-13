/*************************************************************************************
 This file creates a new Controller called NotifierSvc

 Brings in mvToastr

 creates 2 objects: notify and error.

 notify: will render success msg
 error:  will render error msg

 create single core library that could be customized.

 Toastr is a notification or indicator box
 ***************************************************************************************/

angular.module('app').value('mvToastr', toastr);

angular.module('app').factory('NotifierSvc', function (mvToastr) {
	return{
		notify: function (msg) {
			mvToastr.success(msg);
		},
		error: function (msg) {
			mvToastr.error(msg);
		}
	}
});

