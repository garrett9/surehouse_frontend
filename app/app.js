var app = angular.module('app', ['nvd3', 'tableSort', 'angular-ladda', 'checklist-model', 'ngRoute', 'ngStorage', 'angular-loading-bar', 'ngSanitize', 'ngCsv']);

app.config(function configure($routeProvider, $httpProvider, laddaProvider) {

	/**
	 * The first step is to establish out routes, the controllers that are used in them, and the template that they use.
	 */
	$routeProvider
	/**
	 * Routes that use the UsersController
	 */
	.when('/Users/Login', {
		controller: 'UsersController', 
		templateUrl: 'app/templates/users/login.html',
		title: 'Login'
	})
	.when('/', {
		templateUrl: 'app/templates/charts/dashboard.html',
		controller: 'DashboardController',
		title: 'Weclome!'
	})
	.when('/eGuage/A', {
		templateUrl: 'app/templates/charts/eguage_a.html',
		title: 'eGuage A'
	})
	.when('/eGuage/B', {
		templateUrl: 'app/templates/charts/eguage_b.html',
		title: 'eGuage B'
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

	dataConversions = function(input, toServer) {
		// Ignore things that aren't objects.
		if (typeof input !== "object") return input;

		for (var key in input) {
			if (!input.hasOwnProperty(key)) continue;

			var value = input[key];
			var match;
			// Check for string properties which look like dates.
			if (typeof value === "string" && (match = value.match(dateRegex))) {
				if(!toServer) {
					var milliseconds = Date.parse(match[0] + ' UTC')
					if (!isNaN(milliseconds))
						input[key] = milliseconds;
				}
				else {
					var milliseconds = Date.parse(match[0]);
					if(!isNaN(milliseconds)) {
						var date = new Date(milliseconds);
						input[key] = date.getUTCFullYear() + '-' + date.getUTCMonth + '-' + date.getUTCDay() + ' ' + date.getUTCHours + ':' + date.getUTCMinutes();
					}
				}
			} 
			else if(!toServer && isFinite(value)) {
				input[key] = parseInt(value);
			}
			else if (angular.isObject(value) || angular.isArray(value)) {
				// Recurse into object
				dataConversions(value);
			}
		}
		return input;
	}

	/**
	 * Interceptors allow us to intercept requests and responses before being passed onto the controller.
	 */
	$httpProvider.interceptors.push(function($rootScope, $q, $location, $localStorage, $injector, $timeout, URLS) {
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
					dataConversions(config, true);
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
					response.data.payload = dataConversions(response.data.payload);

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
					else if(response.status === 401) {
						delete $localStorage.token;
						$rootScope.authenticated = false;
						$location.path('/Users/Login');
					}
					// If a 419 response is returned, we attempt to refresh the JWT token
					if(response.status == 419 || (response.status === 500 && response.data.status === 419)) {
						var User = $injector.get('User');
						var deferred = $q.defer();
						User.refresh(function(res) {
							// Successfully refreshed the token
							$localStorage.token = res.payload.auth_token;
							var $http = $injector.get('$http');
							$http(response.config).then(deferred.resolve, deferred.reject);
						}, function() {
							// Failed to refresh the token
							delete $localStorage.token;
							$location.path('/Users/Login');
						});
						return deferred.promise;
					}
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
app.run(function($localStorage, $route, $rootScope, $interval, Settings, URLS) {
	if($localStorage.token)
		$rootScope.authenticated = true;
	else
		$rootScope.authenticated = false;

	// Loading = true means that an HTTP request is being performed. False otherwise
	$rootScope.loading = false;

	// Before every route change
	$rootScope.$on('$routeChangeStart', function() {
		$rootScope.status = {};
	});

	// On every successfully route change
	$rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRote) {
		$rootScope.title = $route.current.title;
	});

	// Add some functions to the root scope to get settings regarding the whole system
	// Set the address of the system
	$rootScope.setAddress = function() {
		Settings.setAddress({address: $rootScope.settings.address}, function() {
			$rootScope.settings.success = true;
		}, function() {
			$rootScope.settings.error = true;
		});
	}

	// Set whether the house is in sustainable or resilient mode
	$rootScope.setResilientMode = function(boolean) {
		var boolean = (boolean) ? 1 : 0;
		Settings.setResilientMode(boolean, function(res) {
			$rootScope.settings.resilient_mode = boolean;
		});
	}

	var getSettings = function() {
		Settings.getSettings(function(res) {
			$rootScope.settings.address = res.payload.address;
			$rootScope.settings.resilient_mode = res.payload.resilient_mode;
		});
	}
	
	// Get the settings of the application
	$rootScope.getSettings = function() {
		// Get the settings of the application every minute
		$interval(getSettings, 1000 * 60);
	}
	$rootScope.settings = {};
	getSettings();
	$rootScope.getSettings();
});