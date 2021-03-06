/**
 * The User model.
 */
app.factory('Sensor', function(API) {
	return {
		// Get all users.
		all: function(success, error) {
			API.GET('/Sensors', success, error);
		},
		
		// Create a user.
		create: function(data, success, error) {
			API.POST('/Sensors/Create', data, success, error);
		},
		
		// Get a user.
		get: function(id, success, error) {
			API.GET('/Sensors/' + id, success, error);
		},
		
		// Save a user.
		save: function(id, data, success, error) {
			API.PUT('/Sensors/Edit/' + id, data, success, error);
		},
		
		// Delete a user.
		destroy: function(id, success, error) {
			API.DELETE('/Sensors/Delete/' + id, success, error);
		}
	};
});