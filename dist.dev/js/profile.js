var proMod = angular.module('ProfileMod',[]);

proMod.controller('profileCtrl',function($scope, $location, $window, $state, userSrvc){
	//console.log("entering profileCtrl");
	var $elem = angular.element;
	var credential = userSrvc.credential;
	var userId = credential.userId;
	var userProfile =sessionStorage.getItem("foodbar-userData");
		user = JSON.parse(userProfile);
		
	$scope.logOut = function(){
		console.log("reloading");
		$location.path("/");
		$window.location.reload(forceGet);
		
	};
	$scope.username = localStorage.getItem("foodbar-username");
    $scope.fullName = user.firstName +" "+ user.lastName;	
	$scope.email = user.email;
	$scope.phone = user.phone;
	$scope.age = user.age;
	$scope.creditCard = user.creditCard;
	var address = user.address;
		address = address.split(",");
	$scope.street1 = address[0];
	$scope.street2 = address[1];
	$scope.city = address[2];
	$scope.state = address[3];
	$scope.zipecode = address[4];
	
	$scope.bgcolors = ['#FAEBD7', '#E6E6FA', '#E0FFFF', '#D3D3D3', '#90EE90', '#FFB6C1', '#87CEFA', '#FFA500', '#FFFF00', '#FF6347'];
	
	//get favorite food
	var favFood = user.favFood;
	var list ="";
	for(i = 0; i < favFood.length; i++){
	   list = list + "<label><input type='checkbox' checked='checked'"+ "class='favFood-chkbox'> " +favFood[i] +"</label>";
	}
	$elem("#favFood p").html(list);
	
	//get background color from localstorage
	var bgColor = localStorage.getItem("foodbar-bgcolor");
	console.log(bgColor);
	$elem("#profile section").css("background-color", bgColor);
	
    //Navigate withe the page	
    $scope.goToDiv = function(div){
	  $location.hash(div);
    };
  
    $scope.changeTheme = function(color){
	    $elem("#profile section").css("background-color", color);
		setTimeout(saveToStorage('foodbar-bgcolor', color),30000);
	};

    //load photo on page load
	var img = fetchImage();
	$elem("#displayPhoto").html(img);

    $scope.imageUpload = function(event){
		 var files = event.target.files; //FileList object
		 var file = files[0];
		 var reader = new FileReader();
		 reader.onload = imageIsLoaded; 
		 reader.readAsDataURL(file);
    };

    imageIsLoaded = function(e){
        $scope.$apply(function() {
			var img = new Image();
            img.src = e.target.result;
			img.addEventListener("load", function () {//ensure image is loaded before saving
				setTimeout(saveToStorage('foodbar-photo', getBase64Image(img)),3000);
				var savedImg = fetchImage();
				$elem("#displayPhoto").html(savedImg);
			});
		});
    };

	function getBase64Image(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, 100, 100);

		var dataURL = canvas.toDataURL("image/png");
		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}	
	    
	function fetchImage(){
		var storedImg = localStorage.getItem('foodbar-photo');
		var img = new Image();
		if(storedImg === null){
			img.src="images/defaultPhoto.png";
		}else{
		img.src = "data:image/png;base64," + storedImg;
		}
		return img;
	}    

    function saveToStorage(prop, value){
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem(prop,value);
		}else{
	           alert("Sorry! No Web Storage support.");
			 }
    }
});

proMod.directive('changePhoto', function() {
  return {
    scope:true,
    restrict: 'EA',
    replace: true,
    template:'<a>Upload/Change photo</a>',
    link: function(scope, elem, attrs) {
	  var filePhoto = document.getElementById("filePhoto");
      elem.bind('click', function() {
         if (filePhoto) {
         filePhoto.click();
		 }
        
	  });	  
    }
  };
});

