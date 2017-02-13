/*global angular */

/**
 * The main Foodbar300 app module
 *
 * @type {angular.Module}
 */

angular.module('foodbarApp',['ui.router', 'LoginMod', 'UserMod', 'ProfileMod', 'UtilMod',  
                'RegisterMod', 'MapMod', 'CustMod', 'DriverMod', 'HomeMod', 'RestMod'])
.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');
	
	// HOME STATES AND NESTED VIEWS ========================================
	$stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/partials/home.html'
        })
        .state('register',{
		    url: '/register',
			templateUrl: '/partials/register.html'
		})
		.state('about',{
			url: '/about',
			templateUrl: '/partials/about.html'
		})
		.state('profile',{
			url: '/profile',
			templateUrl: '/partials/profile.html'
		})
		.state('customer',{
			url: '/customer',
			templateUrl: '/partials/customer.html',
		})
		.state('driver',{
			url: '/driver',
			templateUrl: '/partials/driver.html'
		});
});		
			 
		

