/**
 * The UsersController handles anything dealing with users, such as creating, editing, or deleting them.
 */
app.controller('UsersController', function($rootScope, $scope, $location, $localStorage, $timeout, $routeParams, User) {
	/**
	 * The User Model.
	 */
	$scope.user = User.init();

	/**
	 * Attempt to log the user into the system based on the provided credentials.
	 * If successfull, the client will be directed to the home dashboard. On 
	 * failure, the client will be asked for credentials again.
	 */
	$scope.login = function() {
		$scope.authenticating = true;
		User.login($scope.user, function(res) {
			$scope.user = User.init();

			$scope.error = null;
			$scope.success = 'Welcome!';
			$scope.authenticating = false;
			console.log(res);
			$localStorage.token = res.payload.auth_token;

			$timeout(function(){
				$rootScope.showMenu = true;
				$rootScope.authenticated = true;
				$timeout(function() {
					$location.path('Home');
				}, 1000);
			}, 1500);
		}, function(res) {
			$scope.user.password = "";
			$scope.success = null;
			$scope.error = (res != null) ? res.message : 'The server is not currently responding!';
			$scope.authenticating = false;
		});
	};

	/**
	 * The logout function simply deletes the security token on the client's machine,
	 * and redirects them to the login page.
	 */
	$scope.logout = function() {
		$rootScope.user = null;
		delete $localStorage.token;
		$rootScope.noToken = true;
		$timeout(function() {
			$scope.fade = true;
			$rootScope.authenticated = false;
			$timeout(function() {
				$rootScope.showMenu = false;
				$location.path('/');
			}, 1000);
		}, 1000);
	};

	/**
	 * Issue a request for a password reset.
	 */
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

	/**
	 * Send a password reset.
	 */
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

	/**
	 * Get all users in the system.
	 */
	$scope.all = function() {
		$scope.new = $routeParams.new;
		$scope.error = $routeParams.error;
		User.all(function(res, status) {
			if(status == 200)
				$scope.users = res.payload;
			else {
				$scope.users = [];
				$scope.message = 'There are currently no users in the system.';
			}
		});
	}

	/**
	 * Create a user.
	 */
	$scope.create = function() {
		$scope.loading = true;
		User.create($scope.user, function(res, status) {
			$scope.user = User.init();
			$scope.error = null;
			$scope.loading = false;
			$scope.success = 'Successfully created the user.';
			$timeout(function() {
				$scope.fade = true;
				$timeout(function() {
					$location.path('/Users').search({new: res.payload.id});
				}, 1000);
			}, 1500);
		}, function(res) {
			if(res != null && res.status == 400) {
				$scope.loading = false;
				$scope.error = 'Could not create the user. Please fix the errors in the form.';
				$scope.errors = res.payload;
			}
		});
	}

	/**
	 * Get a user.
	 */
	$scope.get = function() {
		User.get($routeParams.id, function(res) {
			$scope.user = User.init();
			$scope.user.name = res.payload.name;
			$scope.user.email = res.payload.email;
			$scope.user.permission = res.payload.permission;
			$scope.show = true;
		});
	}

	/**
	 * Get the current user.
	 */
	$scope.self = function() {
		User.self(function(res) {
			$scope.user = User.init();
			$scope.user.name = res.payload.name;
			$scope.user.email = res.payload.email;
			$scope.loaded = true;
		});
	}

	/**
	 * Change the current user's settings.
	 */
	$scope.manage = function() {
		User.manage($scope.user, function(res) {
			$scope.manage_error = null;
			$scope.manage_errors = null;
			$scope.manage_success = 'Successfully saved your changes.';
		}, function(res) {
			$scope.manage_success = null;
			$scope.manage_error = 'Failed to save your changes!';
			$scope.manage_errors = res.payload;
		});
	}

	/**
	 * Change the current user's password.
	 */
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

	/**
	 * Save a user.
	 */
	$scope.save = function() {
		$scope.loading = true;
		User.save($routeParams.id, $scope.user, function(res) {
			$scope.loading = false;
			$scope.error = null;
			$scope.success = 'Successfully saved your changes.';
			$scope.errors = null;
		}, function(res, status) {
			if(res != null && res.status == 400) {
				$scope.loading = false;
				$scope.success = null;
				$scope.error = 'Could not save your changes! Please fix the errors in the form.';
				$scope.errors = res.payload;
			}
		});
	}

	/**
	 * Delete a user.
	 */
	$scope.delete = function(id, index) {
		if(confirm('Are you sure you want to delete this user?')) {
			$scope.loading = true;
			User.delete(id, function(res, status) {
				$scope.loading = false;
				$scope.success = 'The user has been successfully deleted.';
				$scope.deleted = id;
				$timeout(function() {
					$scope.users.splice(index, 1);
				}, 1000);
			}, function(res, status) {
				$scope.loading = false;
				if(status == 404)
					$scope.error = 'The user was not found!';
				else
					$scope.error = 'Failed to delete the user!';
			});
		}
	}
});