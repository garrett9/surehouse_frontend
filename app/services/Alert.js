/**
 * The User model.
 */
app.factory('Alert', function(API) {
	return {
		// Get all users.
		all: function(success, error) {
			API.GET('/Alerts', success, error);
		},
		
		// Create a user.
		create: function(data, success, error) {
			API.POST('/Alerts/Create', data, success, error);
		},
		
		// Get a user.
		get: function(id, success, error) {
			API.GET('/Alerts/' + id, success, error);
		},
		
		// Save a user.
		save: function(id, data, success, error) {
			API.PUT('/Alerts/Edit/' + id, data, success, error);
		},
		
		// Delete a user.
		destroy: function(id, success, error) {
			API.DELETE('/Alerts/Delete/' + id, success, error);
		}
	};
});