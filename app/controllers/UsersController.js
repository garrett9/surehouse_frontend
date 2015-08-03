/**
 * The UsersController handles anything dealing with users, such as creating, editing, or deleting them.
 */
app.controller('UsersController', function($rootScope, $scope, $location, $localStorage, $timeout, $routeParams, User) {
	
	/*
	 * Attempt to log the user into the system based on the provided credentials.
	 * If successfull, the client will be directed to the home dashboard. On 
	 * failure, the client will be asked for credentials again.
	 */
	$scope.login = function() {
		User.login($scope.user, function(res) {
			delete $scope.user;
			$localStorage.token = res.payload.auth_token;
			$timeout(function(){
				$rootScope.authenticated = true;
				$timeout(function() {
					$location.path('Home');
				}, 1000);
			}, 1500);
		}, function(res) {
			delete $scope.user.password;
		});
	};

	/*
	 * The logout function simply deletes the security token on the client's machine,
	 * and redirects them to the login page.
	 */
	$scope.logout = function() {
		delete $localStorage.token;
		$timeout(function() {
			$rootScope.fade = true;
			$timeout(function() {
				$rootScope.authenticated = false;
				$location.path('/');
				$rootScope.fade = false;
			}, 1000);
		}, 1000);
	};

	// Issue a request for a password reset.
	$scope.sendPasswordReset = function() {
		$scope.loading = true;
		User.sendPasswordReset({'email': $scope.user.email}, function(res) {
			$scope.loading = null;
			$scope.reset_error = null;
			$scope.reset_success = 'Successfully sent an email to the provided address.';
		}, function(res, status) {
			$scope.loading = null;
			$scope.reset_success = null;
			if(status == 400) {
				$scope.reset_error = 'No user was found associated to the provided email address!';
				$scope.user.email = "";
			}
		});
	}

	// Send a password reset.	
	$scope.resetPassword = function() {
		$scope.loading = true;
		User.passwordReset($routeParams.token, {'email': $scope.user.email, 'password': $scope.user.password, 'password_confirmation': $scope.user.password_confirmation}, function(res) {
			$scope.loading = false;
			$scope.error = null;
			$scope.success = "Successfully changed your password."

			$timeout(function(){
				$scope.fadeOut = true;
				$timeout(function() {
					$location.path('/');
				}, 1000);
			}, 1500);
		}, function(res, status) {
			$scope.loading = false;
			$scope.success = null;
			if(status == 400) {
				$scope.error = res.message;
				$scope.errors = res.payload;
			}
		});
	}

	// Get all users in the system.
	$scope.all = function() {
		$scope.n = $routeParams.n;
		User.all(function(res, status) {
			$scope.users = res.payload;
		});
	}

	// Create a user.
	$scope.create = function() {
		User.create($scope.user, function(res, status) {
			delete $scope.user;
			$timeout(function() {
				$timeout(function() {
					$location.path('/Users').search({n: res.payload.id});
				}, 1000);
			}, 1500);
		});
	}

	// Get a user.
	$scope.get = function() {
		User.get($routeParams.id, function(res) {
			$scope.user = res.payload;
			$scope.show = true;
		});
	}

	// Get the current user.
	$scope.self = function() {
		User.self(function(res) {
			$scope.user = res.payload;
		});
	}

	// Change the current user's settings.
	$scope.manage = function() {
		$scope.loading = true;
		User.manage($scope.user, function(res) {
			$scope.loading = false;
			$scope.manage_error = null;
			$scope.manage_errors = null;
			$scope.manage_success = 'Successfully saved your changes.';
		}, function(res) {
			$scope.loading = false;
			$scope.manage_success = null;
			$scope.manage_error = 'Failed to save your changes!';
			$scope.manage_errors = res.payload;
		});
	}

	// Change the current user's password.
	$scope.changePassword = function() {
		User.changePassword($scope.user, function(res) {
			$scope.password_error = null;
			$scope.password_errors = null;
			$scope.password_success = 'Successfully changed your password.';
			$scope.user.new_password = "";
			$scope.user.confirm_password = "";
			$scope.user.old_password = "";
		}, function(res) {
			$scope.password_success = null;
			$scope.password_error = 'Failed to change your password!';
			$scope.password_errors = res.payload;
		});
	}

	// Save a user.
	$scope.save = function() {
		User.save($routeParams.id, $scope.user);
	}

	// Delete a user.
	$scope.destroy = function(id, index) {
		if(confirm('Are you sure you want to delete this user?')) {
			User.destroy(id, function(res, status) {
				$scope.message = 'The user has been successfully deleted.';
				$scope.deleted = id;
				$timeout(function() {
					$scope.users.splice(index, 1);
				}, 1000);
			});
		}
	}
});