var UtilMod = angular.module('UtilMod', []);

////tax rates for individual states////
UtilMod.value('taxRate',
               {'NY': 0.075,
			    'MA': 0.065,
			    'CA': 0.085
			   }
			 );

////////delivery fee for different locations			 
UtilMod.value('deliveryFee',
               {'NY': 5.50,
			    'MA': 4.50,
				'CA': 6.00
			   }
			);


UtilMod.factory('citySrvc',['$http',function($http){
	
     var citySrvc ={
		            cities:{}
	               };
	
	//Get all available cities
     citySrvc.getCities = function(){
		 if(citySrvc.cities.length){ //Check if cities are already populated
		     return; 
			 }
		return $http.get('/json/cities.json')
		    .success(function(res){
			          citySrvc.cities = res.cities;
			});			
	 };
	 return citySrvc;
}]);

UtilMod.factory('orderSrvc',['$http', function($http){
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




   