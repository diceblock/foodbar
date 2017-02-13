var CustMod = angular.module('CustMod', ['ngSanitize', 'ui.bootstrap']);
//when ng-bind-html is used in the view ngSanitize must be use to sanitize the data.


CustMod.controller( 'custCtrl',custCtrl); 
       function custCtrl($uibModal, restSrvc, orderSrvc, userSrvc, geoSrvc, $scope){ 
            console.log("This is the customer controller");
		    var cc = this; 
		    restSrvc.getRests(); 
		    cc.data = restSrvc;
			cc.geoData = geoSrvc;
			cc.restStreet ="";
			cc.order = orderSrvc;
			$scope.distance = geoSrvc.timeDist.dist;
            console.log("first restaurant: " + JSON.stringify(cc.data.rests));
			
		    cc.open = function (selectRest) {
                                 console.log('opening pop up');
            var uibModalInstance = $uibModal.open({
		                                templateUrl: '/partials/orderFood.html',
                                         controller: ['$uibModal', '$uibModalInstance', 'restSrvc', orderFoodCtrl],
										 controllerAs: 'ofd',
										 windowClass: 'fdModal'
                                       });
									   setselectedRest(selectRest);
									   console.log(selectRest);
									   
       };
	   
	   setselectedRest = function(restaurant){
		     restSrvc.selectedRest = restaurant;
	    };
		
	   cc.setPickup = function(){
		   var restId = cc.data.selectedRest.Id;
		   var recipeId = cc.data.selectedMenu.Id;
		   var userId = userSrvc.user.userId;
		   //restSrvc.show.confirm = false;
		   //restSrvc.show.pending = true;
		   restSrvc.orderNo = orderSrvc.saveOrderRequest(userId, restId, recipeId);
		   
		   var modalInstance = $uibModal.open({
				     templateUrl: '/partials/payment.html',
					 controller: ['$scope', 'userSrvc', 'restSrvc', 'deliveryFee', 'taxRate', '$uibModalInstance', paymentCtrl],
					 controllerAs: 'pym',
					 windowClass: 'fdModal'
				   });
	   };
	   
	   
	   cc.cancelRequest = function(){
		   geoSrvc.removeMarker();
		   restSrvc.selectedRest = {};
		   restSrvc.show.request = true;
		   restSrvc.show.confirm = false;
		   restSrvc.show.pending = false;
	   };
	   cc.status ="awaiting driver";
	   
	   $scope.$watch(function(){
	     return (cc.geoData.timeDist.dist[0]);
		 },
		   function(newValue, oldValue){
			   console.log("distance: "+newValue);
		       $scope.distance = newValue;
		   }, true);
		   
		$scope.$watch(function(){
	     return (cc.order.orderStat);
		 },
		   function(newValue, oldValue){
			   console.log("estimate time: "+newValue.time);
		       
		   }, true);
}

CustMod.controller('orderFoodCtrl', orderFoodCtrl); 
       function orderFoodCtrl($uibModal, $uibModalInstance, restSrvc){
		   var ofd = this;
		   
		   ofd.restaurant = restSrvc.selectedRest;
		   
		   
		   selectMenu = function(menu){
			   restSrvc.selectedMenu= menu;
			   openModal();
		   };
			   openModal = function () {
			   var modalInstance = $uibModal.open({
				                         
                                         templateUrl: '/partials/menu.html',
             							 controller: ['$uibModalInstance', '$uibModal', 'restSrvc', '$scope', menuCtrl],
										 controllerAs: 'mn',
										 windowClass: 'fdModal'
                                       });
		     };
		    ofd.selectMenu = selectMenu;
		   
		    ofd.cancel = function () {
						 $uibModalInstance.dismiss('cancel');
                     };
}

CustMod.controller('menuCtrl', menuCtrl);
       function menuCtrl($uibModalInstance, $uibModal, restSrvc, $scope){
		    
			var mn = this;
			
		    mn.menu = restSrvc.selectedMenu;
			mn.restaurant = restSrvc.selectedRest;
			console.log(mn.menu);
			mn.close = function() {
                     $uibModalInstance.dismiss('cancel');
			};
			mn.placeOrder = function(){
				
				var modalInstance = $uibModal.open({
				                         
                                         templateUrl: '/partials/delAddress.html',
             							 controller: ['$scope', 'userSrvc', 'restSrvc', 'geoSrvc', '$uibModalStack', addressCtrl],
										 controllerAs: 'add',
										 windowClass: 'fdModal'
										 
                                       });
				
			};
}

CustMod.controller('orderDetailCtrl', ['$scope', 'userSrvc', function($scope, userSrvc){
	 var userProfile =sessionStorage.getItem("foodbar-userData");
		user = JSON.parse(userProfile);
	
	$scope.show = false;
	$scope.username = localStorage.getItem("foodbar-username");
    $scope.fullName = user.firstName +" "+ user.lastName;	
	$scope.email = user.email;
	$scope.phone = user.phone;
	$scope.creditCard = user.creditCard;

}]);

CustMod.controller('addressCtrl', addressCtrl);
     function addressCtrl($scope, userSrvc, restSrvc, geoSrvc, $uibModalStack){
		 console.log("This is addressCtrl");
		 var add = this;
		  add.restData = restSrvc;
		 
		 var userProfile =sessionStorage.getItem("foodbar-userData");
		user = JSON.parse(userProfile);
	
		$scope.fullName = user.firstName +" "+ user.lastName;
		var address = user.address;
			address = address.split(",");
		$scope.address = address[0].trim();
		$scope.city = address[1].trim();
		$scope.zipcode = address[2].trim();
		state= address[2].trim().substring(0, 2);	
		console.log(state);
		
				
		$scope.submit = function(){
			 var deliveryAddress = $scope.address +", "+ $scope.city+", "+$scope.zipcode;
			getDist(deliveryAddress);
			restSrvc.show.request = false;
			restSrvc.show.confirm = true;
			
			$uibModalStack.dismissAll();	
		};
		
		getDist = function(deliveryAddress){
		   var restLatLng =restSrvc.selectedRest.latLng;
		   var restAddress = restSrvc.selectedRest.address+ " "+ restSrvc.selectedRest.city;
		   console.log(deliveryAddress);
		   geoSrvc.getLatLng(deliveryAddress).then(function(){
			   console.log("calling get time dist");
			   var userLatLng = geoSrvc.latLng;
			   console.log("user latLng: "+ JSON.stringify(userLatLng));
			   geoSrvc.removeMarker();
			   geoSrvc.setMarker(userLatLng, "Del address", "home");
			   var restName = restSrvc.selectedRest.name;
			   geoSrvc.setMarker(restLatLng, "restName", "restaurant");
			   geoSrvc.getTimeDist(restAddress, [deliveryAddress]).then(function(){
			   $scope.distance = geoSrvc.timeDist.dist[0];
			   });
			   
			});
		};
}

CustMod.controller('paymentCtrl',paymentCtrl);
     function paymentCtrl($scope, userSrvc, restSrvc, deliveryFee, taxRate, $uibModalInstance){
		 console.log("This is paymentCtrl");
		 var pym = this;
		 pym.restData = restSrvc;
		 
		 var creditCard = user.creditCard.trim();
		$scope.last4cc = creditCard.slice(-4);
		var state = restSrvc.selectedRest.state; 
		var subTotal= pym.restData.selectedMenu.cost;
		subTotal = parseFloat(subTotal);
		subTotal =Math.round(subTotal*1e2)/1e2;
		$scope.subTotal = subTotal.toFixed(2);
		var fee = parseFloat(deliveryFee[state]);
		fee = Math.round(fee*1e2)/1e2;
		$scope.fee = fee.toFixed(2);
		$scope.tip = "";
		var rate = parseFloat(taxRate[state]);
		var tax = subTotal*rate;
		tax = Math.round(tax*1e2)/1e2;
		$scope.tax = tax.toFixed(2);
		var total = subTotal + tax + fee;
		
		$scope.$watch(function(){
		return $scope.tip;
		},
	        function() {
			    if($scope.tip < 0 || isNaN($scope.tip)){
					 $scope.error = "please enter a positive number ";
					 return;
			    }else if(!$scope.tip.length){
					 $scope.total= Math.round( total*1e2)/1e2;
					 return;
				}
				tip = parseFloat($scope.tip);
				newTotal = total + tip ;
				console.log("total: "+ newTotal);
				$scope.total= Math.round( newTotal*1e2)/1e2;				
				}, true); 
				
		$scope.submit = function(){
			if(!$scope.tip.length || $scope.tip < 0 || isNaN($scope.tip) ){
				$scope.error = "please enter a tip amount ";
				return;
				}
			console.log("tip: "+$scope.tip);
			console.log("total: "+$scope.total);
			/*code for submitting payment goes here
			-------------------------------------*/
			restSrvc.show.confirm = false;
			restSrvc.show.pending = true;
			
			$uibModalInstance.dismiss('cancel');
				
		};
}

CustMod.controller( 'mapCtrl',['$scope', 'geoSrvc', 'userSrvc', 'restSrvc', function($scope, geoSrvc, userSrvc, restSrvc){
        
		$scope.restSrvc = restSrvc;	
        var userLatLng = userSrvc.user.latLng;
		//console.log("user latLng:" + JSON.stringify(userLatLng));
		geoSrvc.initializeMap(); 
		geoSrvc.setMarker(userLatLng, "home", "home");
}]);