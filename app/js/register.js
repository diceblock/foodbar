angular.module('RegisterMod',[])
.controller('registerCtrl',registerCtrl);
    function registerCtrl ($scope, userSrvc){
        $scope.email="";
		$scope.password="";
		$scope.password1 = "";
		$scope.firstName="";
		$scope.lastName="";
		$scope.address="";
		$scope.street="";
		$scope.city="";
		$scope.zipcode="";
   
   $scope.submit = function(){
	   if ($scope.password != $scope.password1){
		   angular.element("#pwError").show().html("Pass words does not match");
	       return;
        }
	   userSrvc.registerUser($scope.email, $scope.password, $scope.firstName, $scope.lastName,
                             $scope.address, $scope.street, $scope.city, $scope.zipcode);
	};
}