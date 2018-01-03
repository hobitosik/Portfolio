angular.module('myApp').controller('AuctionCtrl',
function ($scope, $state, $http, $filter, jwtHelper, vote, categories) {
	$scope.get_this_cat = function (id) {
		var cat = $filter('filter')(categories, {id: id}, true)[0];
		return cat.name;
	}
	
	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == "main.services.auction") {
			$state.go("main.services.auction.lots");
		}

		if (toState.name == "main.services.auction.lots") {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.services.auction": "Аукцион"
			}
			$scope.breadcrumb_active = "Лоты";
		}

		if (toState.name == "main.services.auction.lotDetails") {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.services.auction": "Аукцион",
			}
			$scope.breadcrumb_active = "Лот №" + toParams.id;
		}

		if (toState.name == "main.services.auction.addLot") {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.services.auction": "Аукцион",
				"main.services.auction.lots": "Лоты",
			}
			$scope.breadcrumb_active = "Добавить лот";
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