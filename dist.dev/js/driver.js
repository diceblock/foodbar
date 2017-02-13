var drvMod = angular.module('DriverMod', ['DvrSrvcMod']);

drvMod.controller('driverCtrl',driverCtrl);
    function driverCtrl (driverSrvc, orderSrvc, geoSrvc, $window){
		var drv = this;
		drv.data = driverSrvc;
		drv.geoData = geoSrvc;
		drv.progress = "None selected";
		
		var selectedOrder = drv.data.selectedOrder;
		var restName;
		
		
		drv.upDate = function(){
			geoSrvc.getLocation().then(function(){
				geoSrvc.getAddress().then(function(){
					drv.currentLocation = geoSrvc.address;
					if(drv.data.show.landing){
						getData();//Only run function for landing section on driver.html
					}else {
					displayMap();
					}
				});
			});
	    };
		
		getData = function(){
			orderSrvc.getOrders().then(function(){
		        console.log("orders: " +JSON.stringify(orderSrvc.orders));
				console.log("geoSrvc.timeDist: "+ JSON.stringify(geoSrvc.timeDist));
		         
		        var orders = orderSrvc.orders;
				var tableData = [];	
		        orders.forEach(function(order, index){
					console.log(order.rest); 
					var restAddress = order.rest.address;
					var userAddress = order.user.address;
					var subTotal = order.recipe.cost;
					var driverLatLng =geoSrvc.googlePosition;
					var origins = restAddress;
					var destinations = [driverLatLng, userAddress];
										
					geoSrvc.getTimeDist(origins, destinations).then(function(){
						 console.log(order.rest.name);
						 restName = order.rest.name;
						 var style = order.rest.style;
						 var drvToRest =  geoSrvc.timeDist.dist[0];
						 console.log("miles away "+drvToRest);
						 var restToUser = geoSrvc.timeDist.dist[1];
						 console.log("miles away "+restToUser);
						 var totalDist = parseFloat(drvToRest) + parseFloat(restToUser);
						 var rowData = {
										'index': index,
										'restName': restName, 
										'restAddress': restAddress,
										'userAddress': userAddress,
										'driverLatLng': driverLatLng,													
										'style': style, 
										'milesAway': drvToRest, 
										'totalDist': totalDist,
										'subTotal': subTotal
										};
						 tableData.push(rowData);
						});
					driverSrvc.tableData = tableData;
	            });								
		    });
		};
		
	    drv.selectRequest = function(i){
			driverSrvc.show.landing = false;
			driverSrvc.show.request = true;
			drv.progress = "To be pick up";
			var driverLatLng = drv.data.tableData[i].driverLatLng;
			var restAddress = drv.data.tableData[i].restAddress;
			var userAddress = drv.data.tableData[i].userAddress;
			console.log("restAddress: "+restAddress);
			console.log("driver LatLng: "+driverLatLng);
			console.log("userAddress: "+userAddress);
			driverSrvc.selectedOrder = {
								 "restAddress": restAddress,
								 "userAddress": userAddress,
								 "driverLatLng": driverLatLng
								};
			displayMap();
		};
		
		displayMap = function(){
			geoSrvc.initializeMap();
			var dvrLatLng = driverSrvc.selectedOrder.driverLatLng;
			var uAddress =  driverSrvc.selectedOrder.userAddress;
			var rAddress =  driverSrvc.selectedOrder.restAddress;
			if(driverSrvc.show.request){				
				geoSrvc.getRoute(dvrLatLng, uAddress, rAddress).then(function(){
					var leg1 = geoSrvc.route.legs[0];
					var leg2 = geoSrvc.route.legs[1];
					drv.distance = leg1.distance.text;
					drv.duration = leg1.duration.text;
					geoSrvc.setMarker(leg1.start_location, "driver", "driver");
					geoSrvc.setMarker(leg1.end_location, "home", "home");
					geoSrvc.setMarker(leg2.end_location, restName, "restaurant");
					console.log("distance: "+drv.distance+ " duration: "+ drv.duration);
					var duration = parseFloat(drv.duration);
					//removeIf(production) 
					//simulate driving to restaurant for testing only 
					duration = Math.random() - 0.2;
					console.log(" new duration: " +duration);
					//endRemoveIf(production) 
					if(duration < 0.25){//driver is at restaurant
						driverSrvc.show.request = false;
						driverSrvc.show.enroute = true;
						drv.progress = "In Progress";
						}
				});
				}else{
					rAddress = null;
					geoSrvc.getRoute(dvrLatLng, uAddress, rAddress).then(function(){
						var leg1 = geoSrvc.route.legs[0];
						drv.distance = leg1.distance.text;
						drv.duration = leg1.duration.text;
						geoSrvc.setMarker(leg1.start_location, "driver", "driver");
						geoSrvc.setMarker(leg1.end_location, "home", "home");
					
				    });
				}
		};
		
		drv.notifyPu = function(){
			driverSrvc.show.enroute= false;
			driverSrvc.show.delivered=true;
			orderSrvc.removeOrder(selectedOrder);
			displayMap();
		};
		
		drv.notifyDel = function(){
			orderSrvc.saveToDb(selectedOrder);
			$window.location.reload();
			};
	drv.upDate();
	
	}