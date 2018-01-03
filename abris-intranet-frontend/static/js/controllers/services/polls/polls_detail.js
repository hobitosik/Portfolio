angular.module('myApp').controller('PollsDetailCtrl',
function ($scope, $state, $http, jwtHelper, poll) {
	$scope.poll = poll;

	$scope.$on('$stateChangeStart',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == 'main.services.polls.detail.result') {
			if (!poll.answered) {
				$state.go("main.services.polls.detail.questions");
			}
		}
	});
});