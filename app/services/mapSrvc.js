var mapMod = angular.module('MapMod',[])
.factory('geoSrvc', ['$q', '$http', '$rootScope', '$timeout', function($q, $http, $rootScope, $timeout){
		
        var geoSrvc ={
			          userLocation: "",
					  restLocation: "",
					  driverLocation: "",
			          address: "",
					  latLng: "",
			          googlePosition: "",
			          timeDist: {"dist":[],
					             "time":[]
								},
					  route: {}
		              };
		var map;
		var mapOptn= {
					   center: {lat: 40.683583, lng:  -73.856385},
					   zoom: 12,
					   mapTypeId: google.maps.MapTypeId.ROADMAP
					 };
		var homeIcon = '/images/home-icon.png';
		var driverIcon = '/images/driver-icon.png';
		var restIcon = '/images/restaurant-icon.png';
		
        geoSrvc.getLocation = function() {
            var defer = $q.defer();
            // If supported and have permission for location...
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    geoSrvc.googlePosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    console.log('googlePosition: ' +geoSrvc.googlePosition);
					defer.resolve(geoSrvc.googlePosition);
               }, function(error){
                    defer.reject({message: error.message, code:error.code});
                                 },optn = {
			                                enableHighAccuracy : false,
			                                timeout : Infinity,
			                                maximumAge : 1000
						                   }
               );
			   }else {
                   error('Geolocation not supported');
				   return;
                   }
            return defer.promise;
        };
		
		geoSrvc.initializeMap = function(){
			
			console.log("Initializing map");
           map = geoSrvc.map = new google.maps.Map(document.getElementById("map"), mapOptn);
			
		};
        var markers = [];
        geoSrvc.setMarker = function(latLng, title, icon){ 
		    var marker= new google.maps.Marker({
					position: latLng,
					icon: setIcon(icon),
					map: geoSrvc.map,
					optimized: true,
					title: title
					});
			    markers.push(marker);
        };
		
        geoSrvc.removeMarker = function(){
					var marker = markers.pop();
					marker.setMap(null);
		};
		
        function setIcon(icon){
			switch(icon) {
					case "home":
						icon = homeIcon;
						break;
					case "driver":
						icon = driverIcon;
						break;
					case "restaurant":
						icon = restIcon;
						break;
					default:
						icon = "";
				}
			return icon;
		}
		
		geoSrvc.getTimeDist = function(origin, dest){
			console.log("destinations :" + dest);
			console.log("origins : "+ origin);
			var defer = $q.defer();
			var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
               origins: [origin],
               destinations: dest,
               travelMode: 'DRIVING',
               unitSystem: google.maps.UnitSystem.IMPERIAL,
               avoidHighways: false,
               avoidTolls: false
            }, function(response, status) {
                 if (status !== 'OK') {
                     alert('Error was: ' + status);
                 } else {
                         console.log("DistanceMatrixService" + JSON.stringify(response));
						 var dist0 = response.rows[0].elements[0].distance.text;
						 var time0 = response.rows[0].elements[0].duration.text;
						 var dist1 = 0;
						 var time1 = 0;
						 if(response.rows[0].elements[1]){
							dist1 = response.rows[0].elements[1].distance.text;
						    time1 = response.rows[0].elements[1].duration.text; 
						 }
						 geoSrvc.timeDist ={"dist": [dist0, dist1],
						                     "time": [time0, time1]
											 };
				         defer.resolve(geoSrvc.timeDist);
						 $rootScope.$apply();
                 }
			});
			return defer.promise;
		};
      
      geoSrvc.getRoute = function(origin, dest, wayPt){
		var defer = $q.defer();
		var request;
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer(
		{
		   suppressMarkers: true,
		   suppressInfoWindows: false
		});
		directionsDisplay.setMap(map);
		if(wayPt){
			   request = {
			   origin:origin,
			   destination:dest,
			   waypoints:[{location:wayPt, stopover:true}],
			   travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
		}else{
			   request = {
			   origin:origin,
			   destination:dest,
			   travelMode: google.maps.DirectionsTravelMode.DRIVING
			};
		}
		directionsService.route(request, function(response, status)
		{
		   if (status == google.maps.DirectionsStatus.OK)
		     {
			  directionsDisplay.setDirections(response);
			  defer.resolve(geoSrvc.route = response.routes[0]);
			  return geoSrvc.route;
		     }
		});
		return defer.promise;
	  };
	  
	  geoSrvc.getLatLng = function(address){
		   console.log(address);
			var defer = $q.defer();
			var geocoder = new google.maps.Geocoder();
			
			geocoder.geocode( { 'address': address}, function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
				  if(results[0]){
				      
				      defer.resolve (geoSrvc.latLng = results[0].geometry.location);
					} else {
							alert('No results found');
						   }
				} else {
						alert('Geocoder failed due to: ' + status);
					   }
              });
			return defer.promise;
		};
      geoSrvc.getAddress = function(){ 
	    var defer = $q.defer(); 
	    var geocoder = new google.maps.Geocoder();
	    geocoder.geocode({
		'latLng' : geoSrvc.googlePosition
	                   }, function(results, status) {
		                    if (status == google.maps.GeocoderStatus.OK) {
			                    if (results[1]) {
			                        defer.resolve(geoSrvc.address = results[1].formatted_address);
								} else {
				                        alert('No results found');
		                               }
		                    } else {
			                        alert('Geocoder failed due to: ' + status);
		                           }
                          }
						);
			return defer.promise;
	  };
	return geoSrvc;
		
}]);
						



