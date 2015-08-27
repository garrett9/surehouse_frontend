app.controller('QueryController', function($scope, $timeout, $location, $localStorage, $routeParams, Query) {
	
	$scope.isCustom = false;
	$scope.params = Query.init();
	$scope.sortType = 'Time';
	$scope.sortReverse = true;
	$scope.name = '';

	/**
	 * Redirec to a new Query page.
	 */
	$scope.newQuery = function() {
		$location.path('/Query');
	}
	
	/**
	 * Saves a built query to local storage.
	 */
	$scope.saveQuery = function(params) {
		if($scope.name && $scope.name.length > 0) {
			if(!$localStorage.queries)
				$localStorage.queries = {};
			
			if(Object.keys($localStorage.queries).length < 20) {
				if(!$localStorage.queries[$scope.name]) {
					params.isCustom = $scope.isCustom;
					$localStorage.queries[$scope.name] = JSON.stringify(params);
					$scope.save_query_error = false;
					$scope.save_query_success = true;
					$scope.save_query_message = 'Successfully saved your query.';
					
					$scope.name = '';
				}
				else {
					$scope.save_query_error = true;
					$scope.save_query_success = false;
					$scope.save_query_message = 'You have already saved a query with this same name!';
				}
			}
			else {
				$scope.save_query_error = true;
				$scope.save_query_success = false;
				$scope.save_query_message = 'You currently have saved the max number of queries. You must delete some before saving more!';
			}
		} else {
			$scope.save_query_success = false;
			$scope.save_query_error = true;
			$scope.save_query_message = 'Please enter a name for your query.';
		}
	}
	
	/**
	 * Gets the saved queries from local storage, and attaches them to the scope.
	 */
	$scope.getQueries = function() {
		if($localStorage.queries)
			$scope.queries = $localStorage.queries;
		else
			$scope.queries = null;
	}
	
	/**
	 * Gets a single saved query from local storage, and attaches it to the scope.
	 */
	$scope.loadQuery = function(name) {
		if($localStorage.queries && $localStorage.queries[name]) {
			$scope.params = JSON.parse($localStorage.queries[name]);
			$scope.isCustom = $scope.params.isCustom;
			delete $scope.isCustom;
		}
	}
	
	/**
	 * Deletes a single saved query from local storage.
	 */
	$scope.deleteQuery = function(name) {
		if($localStorage.queries && $localStorage.queries[name]) {
			if(confirm('Are you sure you want to delete this query?')) {
				delete $localStorage.queries[name];
				if(Object.keys($localStorage.queries).length <= 0)
					delete $localStorage.queries;
				$scope.getQueries();
			}
		}
	}
	
	/**
	 * Deletes all saved queries from local storage.
	 */
	$scope.deleteQueries = function() {
		delete $localStorage.queries;
	}
	
	/**
	 * Handles the redirection from the Query page to the Results page.
	 */
	$scope.query = function() {
		var params;
		if($.isArray($scope.params['sensors[]']) && $scope.params['sensors[]'].length > 0) {
			$scope.error = false;
			if($scope.isCustom) {
				// Format a date to be Y-m-d
				var formatDate = function(date) {
					return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
				}
				
				// Format a time to be H:i
				var formatTime = function(date) {
					return date.getHours() + ':' + date.getMinutes();
				}

				if($scope.params.toDateObj) {
					$scope.params.toDate = formatDate($scope.params.toDateObj);
					delete $scope.params.toDateObj;
				}
				if($scope.params.toTimeObj) {
					$scope.params.toTime = formatTime($scope.params.toTimeObj);
					delete $scope.params.toTimeObj;
				}
				if($scope.params.fromDateObj) {
					$scope.params.fromDate = formatDate($scope.params.fromDateObj);
					delete $scope.params.fromDateObj;
				}
				if($scope.params.fromTimeObj) {
					$scope.params.fromTime = formatTime($scope.params.fromTimeObj);
					delete $scope.params.fromTimeObj;
				}
				
				$scope.params.isCustom = true;
				$location.path('/Query/Custom').search($scope.params);
			}
			else
				$location.path('/Query/Recent').search($scope.params);
		}
		else {
			$scope.error = true;
			$scope.message = 'You must select a sensor before perfomring a query!';
		}
	}
	
	/**
	 * Retrieve the results from the SureHouse back end data feeds.
	 */
	$scope.results = function() {
		$scope.loading = true;
		var params;
		$scope.params = $routeParams;
		
		if($scope.params.aggregate)
			$scope.params.aggregate = parseInt($scope.params.aggregate) | '';
		if($scope.params.rows)
			$scope.params.rows = parseInt($scope.params.rows) | '';
		if($scope.params.minutes)
			$scope.params.minutes = parseInt($scope.params.minutes) | '';
		if($scope.params.skip)
			$scope.params.skip = parseInt($scope.params.skip) | '';
		
		if($scope.params.chart) {
			$scope.chart = $scope.params.chart;
			delete $scope.params.chart;
		}
		
		if($routeParams['sensors[]'].length > 0) {
			$scope.error = false;
			var success = function(res) {
				$scope.error = false;
				$scope.payload = res.payload;
				$scope.headers = [];
				if($scope.payload.length > 0)
					for(var h in $scope.payload[0])
						$scope.headers.push(h);
				$scope.loading = false;
			};
			
			var error = function(res) {
				$scope.error = true;
				$scope.message = res.message;
				$scope.loading = false;
			};
			
			if($location.path() == '/Query/Custom') {
				Query.custom($routeParams, success, error);
				$scope.isCustom = true;
			}
			else {
				Query.recent($routeParams, success, error);
				$scope.isCustom = false;
			}
		}
		else {
			$scope.error = true;
			$location.path('/Query');
		}
	}
	
	/**
	 * Clear all message related vars from the scope.
	 */
	$scope.clearMessages = function() {
		$scope.save_query_error = false;
		$scope.save_query_success = false;
		$scope.save_query_message = null;
		$scope.name = '';
	}
});