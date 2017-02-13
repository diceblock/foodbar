
var HomeMod = angular.module('HomeMod', []);

HomeMod.controller('homeCtrl', homeCtrl);
function homeCtrl($scope, $http, citySrvc){
	var $elem = angular.element;  
	
	$scope.updateCity = 
	function updateCity(zipcode){
		console.log("update city");
		if(citySrvc.cities.length){//Check if cities are already populated
		var cities = citySrvc.cities;
		console.log(cities);
		for(var i=0; i< cities.length; i++){
			if(zipcode == cities[i]){
				console.log("City is available.");
				$elem("#cityCheck").html("City is available.");
				$elem("#cityCheck").css('color', 'green');
				return;
				}else{
					console.log("City is not available.");
					$elem("#cityCheck").html("City is not yet in our system.");
					$elem("#cityCheck").css('color', 'red');
				}
		    }
		}else{
		
	citySrvc.getCities()
		.then(function(){
			var cities = citySrvc.cities;
			console.log(cities);
			for(var i=0; i< cities.length; i++){
			  if(zipcode == cities[i]){
				console.log("City is available.");
				$elem("#cityCheck").html("City is available.");
				$elem("#cityCheck").css('color', 'green');
				return;
				}else{
					console.log("City is not available.");
					$elem("#cityCheck").html("City is not yet in our system.");
					$elem("#cityCheck").css('color', 'red');
				}
			}
		});
		}
	};
	
}