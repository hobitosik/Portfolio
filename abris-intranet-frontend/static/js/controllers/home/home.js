angular.module('myApp').controller('HomeCtrl',
function ($scope, $state, $http, jwtHelper, categories, companies, blog) {
	var token = localStorage.getItem('token');
	if (!token || jwtHelper.isTokenExpired(token))
		return;

	$scope.need_home_nav = true;

	$scope.$on('$stateChangeSuccess',
	function(event, toState, toParams, fromState, fromParams) {
		if (toState.name == "main.home.post") {
			$scope.need_home_nav = false;
		} else {
			$scope.need_home_nav = true;
		};

		if (toState.name == 'main.home.media') {
			$state.go('main.home.media.photo');
		}
	});

	$scope.cats = [{id: 0, name: "Рубрика"}].concat(categories);
	for (i = 0; i < $scope.cats.length; i++) {
		$scope.cats[i].index = i;
	}
	$scope.selected_cat = 0;
	
	$scope.filterObj = {};

	$scope.apply_cat_filter = function (val) {
		if (val == 0) {
			delete $scope.filterObj.cats;
		} else {
			$scope.filterObj.cats = {id:$scope.cats[val].id};
		}
	};

	$scope.comps = [{id: 0, name: "Организация"}].concat(companies);
	for (var i = 0; i < $scope.comps.length; i++) {
		$scope.comps[i].index = i;
	}
	$scope.selected_comp = 0;

	$scope.apply_comp_filter = function (val) {
		if (val == 0) {
			delete $scope.filterObj.company;
		} else {
			$scope.filterObj.company = $scope.comps[val].id;
		}
	};
});