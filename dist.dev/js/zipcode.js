// JavaScript Document
onmessage = function(e){
	  console.log('Message received from main script');	
	var city = parseInt(e.data);
	var availableCities =[11200, 11300, 11400, 11600, 11500];
	if (availableCities.indexOf(city) >= 0){
		postMessage(true);
	}else{
		postMessage(false);
		}
};
