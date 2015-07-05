var app = angular.module('surehouse-app', ['angular-ladda', 'checklist-model', 'ngRoute', 'ngStorage', 'angular-loading-bar']);

/**
 * Apply constants for the web app's domain, and the REST API domain.
 */
app.constant('URLS', {
	BASE: 'http://155.246.239.239',
	API: 'https://155.246.239.239'
});


app.config(function configure($routeProvider, $httpProvider, laddaProvider) {
	/**
	 * The first step is to establish out routes, the controllers that are used in them, and the template that they use.
	 */
	$routeProvider
		/**
		 * Routes that use the UsersController
		 */
		.when('/', {
			controller: 'UsersController', 
			templateUrl: 'app/templates/users/login.html'
		})
		.when('/Home', {
			controller: 'HomeController',
			templateUrl: 'app/templates/home/dashboard.html'
		})
		.when('/Users', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/all.html'
		})
		.when('/Users/Logout', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/logout.html'
		})
		.when('/Users/Create', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/create.html'
		})
		.when('/Users/Edit/:id', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/edit.html'
		})
		.when('/Users/Manage', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/manage.html'
		})
			
		/**
		 * Routes for resetting your password.
		 */
		.when('/Passwords/Reset/:token', {
			controller: 'UsersController',
			templateUrl: 'app/templates/users/reset_password.html'
		})
		
		/**
		 * Routes the use the GatewaysController
		 */
		.when('/Gateways', {
			controller: 'GatewaysController',
			templateUrl: 'app/templates/gateways/all.html'
		})
		.when('/Gateways/Create', {
			controller: 'GatewaysController',
			templateUrl: 'app/templates/gateways/create.html'
		})
		.when('/Gateways/Edit/:id', {
			controller: 'GatewaysController',
			templateUrl: 'app/templates/gateways/edit.html'
		})
		
		/**
		 * Routes the use the SensorsController
		 */
		.when('/Sensors', {
			controller: 'SensorsController',
			templateUrl: 'app/templates/sensors/all.html'
		})
		.when('/Sensors/Create', {
			controller: 'SensorsController',
			templateUrl: 'app/templates/sensors/create.html'
		})
		.when('/Sensors/Edit/:id', {
			controller: 'SensorsController',
			templateUrl: 'app/templates/sensors/edit.html'
		})
		
		/**
		 * Routes the use the AlertsController
		 */
		.when('/Alerts', {
			controller: 'AlertsController',
			templateUrl: 'app/templates/alerts/all.html'
		})
		.when('/Alerts/Create', {
			controller: 'AlertsController',
			templateUrl: 'app/templates/alerts/create.html'
		})
		.when('/Alerts/Edit/:id', {
			controller: 'AlertsController',
			templateUrl: 'app/templates/alerts/edit.html'
		})

		/**
		 * Routes that display errors.
		 */
		.when('/403', {
			templateUrl: 'app/templates/errors/403.html',
			controller: 'ErrorController'
		})
		.when('/404', {
			templateUrl: 'app/templates/errors/404.html',
			controller: 'ErrorController'
		})
		.when('/500', {
			templateUrl: 'app/templates/errors/500.html',
			controller: 'ErrorController'
		})
		
		/**
		 * If all other routes haven't been met.
		 */
		.otherwise({
			redirectTo: '/'
		});
	
	/**
	 * The settings for the ladda buttons.
	 */
	laddaProvider.setOption({
		style: 'expand-right'
	});
		
	/**
	 * Interceptors allow us to intercept requests and responses before being passed onto the controller.
	 */
	$httpProvider.interceptors.push(function($rootScope, $q, $location, $localStorage, $timeout, URLS) {
		return {
			/**
			 * Before each HTTP request that is sent out.
			 */
			'request': function(config) {
				config.headers = config.headers || {};
				//If there exists a token on the client's machine, send it in the Authorization header
				if(config.url.indexOf(URLS.API) == 0 && $localStorage.token)
					config.headers.Authorization = 'Bearer ' + $localStorage.token;
				return config;
			},
			/**
			 * Before each HTTP response that goes to the controller.
			 */
			'response': function(response) {
				//Get the new token that is issued on each request
				if(response.config.url.indexOf(URLS.API) == 0 && response.headers()['x-token'])
					$localStorage.token = response.headers()['x-token'];
				return response;
			},
			/**
			 * Before each HTTP response error that goes to the controller.
			 */
			'responseError': function(response) {
				//If we received an unauthorized response, and if we're not on the login page, then redirect the user back to the login page
				if(response.status === 401 && $location.path() != '/') {
					delete $localStorage.token;
					$location.path('/');
				}
				//If a 403 was found
				else if(response.status === 403)
					$location.path('/403');
				//If a 404 was found
				else if(response.status === 404)
					$location.path('/404');
				else if(response.status === 0 || response.status === 500)
					$location.path('/500');
				//Otherwise
				else {
					//If the response still contains a new token that was issued, attempt to save it.
					if(response.config.url.indexOf(URLS.API) == 0 && response.headers()['x-token'])
						$localStorage.token = response.headers()['x-token'];
				}
				return $q.reject(response);
			}
		};
	});
})

/**
 * Run this function when the application launches.
 * This function will check if there is an existing token on the client's machine.
 * If there is, the function will then attempt to communicate with the server to 
 * validate the token. If it is validated, the user continues as normal. If it's
 * not valid, then the user will be redirected to the login page.
 */
app.run(function($localStorage, $rootScope, $location, $http, URLS) {
	$rootScope.authenticated = false;
	$rootScope.noToken = true;
	if($localStorage.token) {
		$rootScope.noToken = false;
		$http.get(URLS.API + '/Users/Refresh').success(function() {
			$rootScope.showMenu = true;
			$rootScope.authenticated = true;
		})
		.error(function() {
			$rootScope.showMenu = false;
			$rootScope.authenticated = false;
			delete $localStorage.token;

			$location.path('/');
		});
	}
	
	/**
	 * Monitor whenever the route is about to change.
	 * If the client does not have a token, redirect them to the login page to get one.
	 */
	$rootScope.$on('$routeChangeStart', function(args) {
		console.log($localStorage.token);
		/*console.log($location.path());
		if(!($localStorage.token)) 
			$location.path('/');*/
	});
});