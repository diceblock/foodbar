var UserMod = angular.module('UserMod',[]);

UserMod.factory('userSrvc', ['$http', '$log', '$state', userSrvc]);
  function userSrvc($http, $log, $state){
	var userSrvc= {
		                user : {},
	                    credential : {},
						deliveryAddress: {}
	                  };
	
	//Test if an object exist
	function isEmpty(obj) { 
          for (var x in obj) { return false; }
             return true;
    }
	
		
	userSrvc.getCredentials = function(username, password){
		return $http.get('/json/credentials.json')
		             .success(function(res){
			           credentials = res.credentials;
					    for(var i=0; i< credentials.length; i++){
						   if(credentials[i].username == username){
					           if(username == credentials[i].username && password == credentials[i].password){
								   console.log(credentials[i]);
						           userSrvc.credential = credentials[i];
								   return userSrvc.credential;
							    }
						   }
						}
					   return;
					 });
	};
	
	userSrvc.getUser = function(userId){
		if(userId === undefined){
			alert("Error you are trying to access this page without signing in");
			return;
		}
		return $http.get('/json/users.json')
		    .success(function(res){
			          users = res.users;
			          for(var i=0; i< users.length; i++){
				          if(userId == users[i].userId){
					         userSrvc.user = users[i];
							 userSrvc.saveUser();
							 return userSrvc.user;
				            }
			}
        return;			
		});					
	};
	
	
	userSrvc.saveUser = function(){
		if(typeof(Storage) !== "undefined"){
		   $log.info("Saving user: " + JSON.stringify(userSrvc.user));
		   sessionStorage.setItem("foodbar-userData", JSON.stringify(userSrvc.user));
		}else{
			alert("Sorry! No Web Storage support.");
		}
		
	};
	
	userSrvc.registerUser = function(){
		console.log('user is registered');
		$state.go('home');
	};
	return userSrvc;
}


