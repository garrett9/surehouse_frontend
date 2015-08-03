var app = angular.module('surehouse-app', ['tableSort', 'angular-ladda', 'checklist-model', 'ngRoute', 'ngStorage', 'angular-loading-bar', 'ngSanitize', 'ngCsv']);

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
		templateUrl: 'app/templates/users/login.html',
		title: 'Welcome!'
	})
	.when('/Home', {
		controller: 'HomeController',
		templateUrl: 'app/templates/home/dashboard.html',
		title: 'Home',
	})
	.when('/Users', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/all.html',
		title: 'Users'
	})
	.when('/Users/Logout', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/logout.html',
		title: 'Logout'
	})
	.when('/Users/Create', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/create.html',
		title: 'Create User'
	})
	.when('/Users/Edit/:id', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/edit.html',
		title: 'Edit User'
	})
	.when('/Users/Manage', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/manage.html',
		title: 'My Profile'
	})

	/**
	 * Routes for resetting your password.
	 */
	.when('/Passwords/Reset/:token', {
		controller: 'UsersController',
		templateUrl: 'app/templates/users/reset_password.html',
		title: 'Reset Password'
	})

	/**
	 * Routes the use the GatewaysController
	 */
	.when('/Gateways', {
		controller: 'GatewaysController',
		templateUrl: 'app/templates/gateways/all.html',
		title: 'Gateways'
	})
	.when('/Gateways/Create', {
		controller: 'GatewaysController',
		templateUrl: 'app/templates/gateways/create.html',
		title: 'Create Gateway'
	})
	.when('/Gateways/Edit/:id', {
		controller: 'GatewaysController',
		templateUrl: 'app/templates/gateways/edit.html',
		title: 'Edit Gateway'
	})

	/**
	 * Routes the use the SensorsController
	 */
	.when('/Sensors', {
		controller: 'SensorsController',
		templateUrl: 'app/templates/sensors/all.html',
		title: 'Sensors'
	})
	.when('/Sensors/Create', {
		controller: 'SensorsController',
		templateUrl: 'app/templates/sensors/create.html',
		title: 'Create Sensor'
	})
	.when('/Sensors/Edit/:id', {
		controller: 'SensorsController',
		templateUrl: 'app/templates/sensors/edit.html',
		title: 'Edit Sensor'
	})

	/**
	 * Routes the use the AlertsController
	 */
	.when('/Alerts', {
		controller: 'AlertsController',
		templateUrl: 'app/templates/alerts/all.html',
		title: 'Alerts'
	})
	.when('/Alerts/Create', {
		controller: 'AlertsController',
		templateUrl: 'app/templates/alerts/create.html',
		title: 'Create Alert'
	})
	.when('/Alerts/Edit/:id', {
		controller: 'AlertsController',
		templateUrl: 'app/templates/alerts/edit.html',
		title: 'Edit Alert'
	})

	/**
	 * Routes that display errors.
	 */
	.when('/403', {
		templateUrl: 'app/templates/errors/403.html',
		controller: 'ErrorController',
		title: '403'
	})
	.when('/404', {
		templateUrl: 'app/templates/errors/404.html',
		controller: 'ErrorController',
		title: '404'
	})
	.when('/500', {
		templateUrl: 'app/templates/errors/500.html',
		controller: 'ErrorController',
		title: '500'
	})

	/**
	 * Query Routes
	 */
	.when('/Query', {
		templateUrl: 'app/templates/query/query.html',
		controller: 'QueryController',
		title: 'Query'
	})
	.when('/Query/Custom', {
		templateUrl: 'app/templates/query/custom.html',
		controller: 'QueryController',
		title: 'Custom Query'
	})
	.when('/Query/Recent', {
		templateUrl: 'app/templates/query/custom.html',
		controller: 'QueryController',
		title: 'Recent Query'
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

	//TODO create module for this
	// Matches YYYY-mm-dd HH:ii:ss dates
	var dateRegex = /^((((19|[2-9]\d)\d{2})[\/\.-](0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](0[13456789]|1[012])[\/\.-](0[1-9]|[12]\d|30)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](02)[\/\.-](0[1-9]|1\d|2[0-8])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[\/\.-](02)[\/\.-](29)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])))$/g;

	var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var monthNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var estOffset = 3600000 * -4; //EDT is 5 hours behind UTC

	utcToLocal = function(input) {
		// Ignore things that aren't objects.
		if (typeof input !== "object") return input;

		for (var key in input) {
			if (!input.hasOwnProperty(key)) continue;

			var value = input[key];
			var match;
			// Check for string properties which look like dates.
			if (typeof value === "string" && (match = value.match(dateRegex))) {
				var milliseconds = Date.parse(match[0])
				if (!isNaN(milliseconds)) {
					date = new Date(milliseconds + estOffset);
					var hour = date.getHours();
					var dd = 'AM';
					if(hour > 12) {
						hour -= 12;
						dd = 'PM';
					}
					var minutes = date.getMinutes();
					if(minutes < 10)
						minutes = '0' + minutes;
					input[key] = dayNames[date.getDay()] + ', ' + monthNames[date.getMonth() + 1] + ', '+ date.getDate() + ' ' + hour + ':' + minutes + ' ' + dd + ' EDT';
				}
			} else if (angular.isObject(value) || angular.isArray(value)) {
				// Recurse into object
				utcToLocal(value);
			}
		}
		return input;
	}

	/**
	 * Interceptors allow us to intercept requests and responses before being passed onto the controller.
	 */
	$httpProvider.interceptors.push(function($rootScope, $q, $location, $localStorage, $timeout, URLS) {
		var setStatus = function(method, isSuccess) {
			$rootScope.status = {};
			switch(method) {
				case 'GET':
					if(isSuccess)
						$rootScope.status.success = true;
					else
						$rootScope.status.error = true;
					break;
				case 'POST':
					if(isSuccess)
						$rootScope.status.post_success = true;
					else
						$rootScope.status.post_error = true;
					break;
				case 'PUT':
					if(isSuccess)
						$rootScope.status.put_success = true;
					else
						$rootScope.status.put_error = true;
					break;
				case 'DELETE':
					if(isSuccess)
						$rootScope.status.delete_success = true;
					else
						$rootScope.status.delete_error = true;
					break;
			}
		}

		return {
			// Upon each successful request
			request: function(config) {
				if(config.url.indexOf(URLS.API) == 0) {
					$rootScope.loading = true;
					$rootScope.status = {};
					if($localStorage.token)
						config.headers.Authorization = 'Bearer ' + $localStorage.token;
				}
				return config;
			},

			// Upon each failed request
			requestError: function(rejection) {
				$rootScope.loading = false;
				return $q.reject(rejection);
			},

			// Upon each successful response
			response: function(response) {
				delete $rootScope.errors;
				//Get the new token that is issued on each request
				if(response.config.url.indexOf(URLS.API) == 0) {
					$rootScope.loading = false;
					setStatus(response.config.method, true);
				}

				if(!angular.isUndefined(response.data.payload))
					response.data.payload = utcToLocal(response.data.payload);

				return response;
			},

			// Upon each failed response
			responseError: function(response) {
				if(response.config.url.indexOf(URLS.API) == 0) {
					$rootScope.loading = false;
					setStatus(response.config.method, false);
					if(response.status === 400) {
						if(response.data.payload)
							$rootScope.errors = response.data.payload;
						else
							delete $rootScope.errors;
					}
					else if(response.status === 401 && $location.path() != '/') {
						delete $localStorage.token;
						$location.path('/');
					}
					else if(response.status === 403)
						$location.path('/403');
					else if(response.status === 404)
						$location.path('/404');
					else if(response.status === 0 || response.status === 500)
						$location.path('/500');
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
app.run(function($localStorage, $route, $rootScope, $location, $http, URLS) {
	// Loading = true means that an HTTP request is being performed. False otherwise
	$rootScope.loading = false;

	// Authenticated = true means that the incoming using is authenticated already
	$rootScope.authenticated = false;

	if($localStorage.token) {
		$http.get(URLS.API + '/Users/Refresh').success(function() {
			$rootScope.authenticated = true;
		})
		.error(function() {
			$rootScope.authenticated = false;
			delete $localStorage.token;
		});
	}

	/**
	 * Monitor whenever the route is about to change.
	 * If the client does not have a token, redirect them to the login page to get one.
	 */
	$rootScope.$on('$routeChangeStart', function(args) {
		//console.log($localStorage.token);
		/*console.log($location.path());
		if(!($localStorage.token)) 
			$location.path('/');*/
	});

	// On every successfully route change
	$rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRote) {
		$rootScope.title = $route.current.title;
	});

	// Execute before closing the window.
	/*$window.onbeforeunload = function (evt) {
		delete $localStorage.token;
	}*/
});