/**
 * The User model.
 */
app.factory('User', function(API) {
	
	return {
		
		// Check to see if a user's JWT is still authenticated
		authenticated: function(success, error) {
			API.GET('/Users/Authenticated', success, error);
		},
		
		// Refresh a user's authentication token
		refresh: function(success, error) {
			API.GET('/Users/Refresh', success, error);
		},
		
		// Attempt to login the user with the user's current credentials.
		login: function(data, success, error) {
			API.POST('/Users/Login', data, success, error);
		},
		
		// Send a request for a password reset.
		sendPasswordReset: function(data, success, error) {
			API.POST('/Users/SendPasswordReset', data, success, error);
		},
	
		// Reset the user's password.
		passwordReset: function(token, data, success, error) {
			API.POST('/Users/ResetPassword/' + token, data, success, error);
		},	
		
		// Get all users.
		all: function(success, error) {
			API.GET('/Users', success, error);
		},
		
		// Create a user.
		create: function(data, success, error) {
			API.POST('/Users/Create', data, success, error);
		},
		
		// Get a user.
		get: function(id, success, error) {
			API.GET('/Users/' + id, success, error);
		},
		
		// Get the current user.
		self: function(success, error) {
			API.GET('/Users/Manage/Account', success, error);
		},
		
		// Change the current user's account settings.
		manage: function(data, success, error) {
			API.PUT('/Users/Manage/Account', data, success, error);
		},
		
		// Change the current user's password.
		changePassword: function(data, success, error) {
			API.PUT('/Users/Change/Password', data, success, error);
		},
		
		// Save a user.
		save: function(id, data, success, error) {
			API.PUT('/Users/' + id, data, success, error);
		},
		
		// Delete a user.
		destroy: function(id, success, error) {
			API.DELETE('/Users/Delete/' + id, success, error);
		}
	};
});
