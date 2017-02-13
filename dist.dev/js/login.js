var loginMod = angular.module('LoginMod',[]);

loginMod.controller('loginCtrl',['$scope', '$state', '$log', '$window', 'userSrvc', 
 function($scope, $state, $log, $window, userSrvc){
	
	var credential =userSrvc.credential ;
	var userId = userSrvc.credential.userId;
	var user = userSrvc.user;
    
	$scope.username = credential.username;
	
	$scope.show = true; 
	$scope.showForm = false;	
	
	$scope.signin = function(){
		$scope.showForm = !$scope.showForm;
	};
	
	
	$scope.logOut = function(){
		console.log("reloading");
		$window.location.reload();
	};
	
	function isEmpty(obj) { 
          for (var x in obj) { return false; }
             return true;
    }
		
	$scope.authenticateUser = function (username, password){
		validatePassword(password); 
	    userSrvc.getCredentials(username, password)
		           .then(function(){
			                 credential = userSrvc.credential;
							 console.log(credential);
                                if(!isEmpty(credential)){
		                           localStorage.setItem("foodbar-username", username);
								   sessionStorage.setItem("foodbar-login", "yes");
								   userSrvc.getUser(credential.userId);
								   $scope.show = false;
								   $scope.showForm = false;
								   if(credential.type == "cust"){
									   $log.info('redirecting to customer Interface');
								       $state.go('customer');
								   }else{
									   $log.info('redirecting to driver Interface');
									   $state.go('driver');
								   }
		                        }else{
			                          angular.element("#pwError").show().html("You have entered a wrong username password combination");
		                             }
					        
					   
            });
    };
	 
	$scope.getUser = function(){
		   console.log(userId);
		   userSrvc.getUser(userId)
           .then(function(){
						     userSrvc.saveUser();
						   });
	};
	
	function validatePassword(pw){
	if(pw.length < 8){
	   angular.element("#pwError").show().html("password must contain at least 8 characters");
	   return false;
	 } 
	 if(pw.search(/[0-9]+/) == -1){
	       angular.element("#pwError").show().html("password must contain at least one number");
	       return false;
     } 
	 if(pw.search(/[a-zA-Z]+/) == -1){
	       angular.element("#pwError").show().html("password must contain at least one letter");
	       return false;
     } 
	 if(pw.search(/[@#$%^&*~!]+/) == -1){
	       angular.element("#pwError").show().html("password must contain at least one special character");
	       return false;
     }
	 return true;
}

}]);
