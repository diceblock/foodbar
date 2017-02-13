angular.module('RestMod',[])
.factory('restSrvc',['$http',function($http){
	
     var restSrvc ={
		            rests: {},
					rest:{},
					recipe:{},
		            selectedRest: {},
					selectedMenu: {},
					orderNo:"",
					show: {'request': true,
						   'confirm': false,
						   'pending': false
						  }
	               };
	 //Get all available restaurants
     restSrvc.getRests = function(){
		 if(restSrvc.rests.length){ //Check if rest is already populated
		     return;
			 }
		return $http.get('/json/restaurants.json')
		    .success(function(res){
			          restSrvc.rests = res.restaurants;
					  
			});			
		};
	
	//Get a restuarant with know restId
	 restSrvc.getRest = function(restId){
		if(restId=== undefined){
			alert("Error restuarant id is missing");
			return;
		}
		rests = restSrvc.getRests();
        for(var i=0; i< rests.length; i++){
			if(restId == rests[i].Id){
			    rest = rests[i];
				restSrvc.rest =rest;
				return restSrvc.rest;
		    }
		}
        return;								
	};
	
	//Get the list of menus for a restaurants
	restSrvc.getRecipe = function(recipeId){
		
		if(recipeId === undefined){
			alert("Error restuarant id is missing");
			return;
		}
		rest = restSrvc.rest;
			          for(var i=0; i< rest.menu.length; i++){
				          if(recipeId == rest.menu[i].Id){
					         restSrvc.recipe = rest.menu[i];
							 return restSrvc.recipe;
				            }
			}
        return;						
	};
	
	return restSrvc;	
}]); 
