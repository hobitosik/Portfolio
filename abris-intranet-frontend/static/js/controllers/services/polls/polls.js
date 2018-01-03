angular.module('myApp').controller('PollsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, vote, polls) {
	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == 'main.services.polls') {
			$state.go('main.services.polls.list');
		}

		if (toState.name == 'main.services.polls.list') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.services.polls": "Опросы"
			}
			$scope.breadcrumb_active = "Список";
		}

		if (toState.name == 'main.services.polls.detail') {
			$state.go('main.services.polls.detail.description');
		}

		if (toState.name == 'main.services.polls.detail.description' || toState.name == 'main.services.polls.detail.questions' || toState.name == 'main.services.polls.detail.result') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.services.polls": "Опросы"
			}
			var _title = $filter('filter')(polls, {id: toParams.id})[0].name;
			var title = _title.slice(0, 16);
			title += _title.length > 16 ? '...' : '';
			$scope.breadcrumb_active = title;
		}
	});

	$scope.like = function (obj, path) {
		vote.like(path + '/' + obj.id).then(function (resp) {
			obj.upvotes = resp.upvotes;
			obj.downvotes = resp.downvotes;
		});
	}

	$scope.dislike = function (obj, path) {
		vote.dislike(path + '/' + obj.id).then(function (resp) {
			obj.upvotes = resp.upvotes;
			obj.downvotes = resp.downvotes;
		});
	}
});