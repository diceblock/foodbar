angular.module('DvrSrvcMod',[])
.factory('driverSrvc', ['$http', 'userSrvc', 'restSrvc', function($http, userSrvc, restSrvc){
	
    var driverSrvc ={
		              selectedOrder:[],
		              restaurants: {},
					  tableData: [],
					  show: {
						   'landing': true, 
						   'request': false,
						   'enroute': false,
						   'delivered': false
						  }
	                 };
	 
   
	return driverSrvc;	
}]); 