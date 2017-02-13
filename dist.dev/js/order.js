var OrderMod = angular.module('OrderMod',[]);

OrderMod.factory('orderSrvc',['$http', function($http){
	var orderSrvc =  {
		     order: {},
		     orderStat: {
						'time': 30,
						'status':'pending'
					  }
	        };
			
    orderSrvc.saveOrderRequest = function(userId, restId, recipeId){
		//code to save order to database go here
		console.log("Order request save to system");
		//removeIf(production) 
		var orderId = 1001023;//for testing remove in production
		//endRemoveIf(production)
		return orderId;
	   };
							   
	orderSrvc.getOrders = function(){
		return $http.get('/json/orders.json')
			.success(function(res){
					 orderSrvc.orders = res.orders.pending;
					 });			
	};
		
    orderSrvc.removeOrder = function(order){
	    console.log("removing order from pending order list in database");
	    //code to remove order goes here
    };
	
	orderSrvc.saveToDb = function(order){
		console.log("saving to database");
		//code to save order goes here
		};
		
    return orderSrvc;	
}]);

