/**
 * The AlertSubscription model.
 */
app.factory('AlertSubscription', function($http, API) {
	return {
		/**
		 * Initialize a subscription.
		 */
		init: function() {
			return {
				alert: "",
				user: "",
				email: "",
				text: ""
			};
		},
		
		/**
		 * Retrieve all alerts in the system, and whether or not the user subscribed to them.
		 */
		all: function(success, error) {
			API.GET('/Alerts/Subscriptions/All', success, error);
		},
		
		/**
		 * Subscribee to multiple alerts.
		 */
		subscribeToMultiple: function(data, success, error) {
			API.POST('/Alerts/Subscriptions/Subscribe', data, success, error);
		}
	}
});