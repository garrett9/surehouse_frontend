/**
 * A simple controller for displaying dashboard information.
 */
app.controller('DashboardController', function($scope, $interval) {
	
	var timeOfDay = function() {
		var hours = $scope.date.getHours();
		if(hours >= 22 || hours < 6)
			return 'wi-moon-waning-crescent-2';
		else if(hours >= 6 && hours < 8)
			return 'wi-sunrise';
		else if(hours >= 19 && hours < 21)
			return 'wi-sunset';
		return 'wi-day-sunny';
	}
	
	// Get the current date and update it by a minute every minute
	$scope.date = new Date();
	$scope.weather_icon = timeOfDay();
	$interval(function() {
		$scope.date.setMinutes($scope.date.getMinutes() + 1);
		$scope.weather_icon = timeOfDay();
	}, 1000 * 60);
});