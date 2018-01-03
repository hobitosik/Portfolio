angular.module('myApp').controller('PollsDetailResultCtrl',
function ($scope, $state, $http, $filter, jwtHelper, poll, results) {
	$scope.poll = poll;

	$scope.results = results;
	
	$scope.results.forEach(function (value, index) {
		value.max_votes = 0;
		value.choices.forEach(function (value1, index1) {
			if (value1.votes > value.max_votes) {
				value.max_votes = value1.votes;
			}
		});

		value.choices.forEach(function (value1, index1) {
			value1.percentage = Math.floor(value1.votes / value.max_votes * 100);
		});
	});
});