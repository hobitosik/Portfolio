angular.module('myApp').controller('BlogCtrl',
function ($scope, $state, $http, jwtHelper, $filter, blog, categories, companies) {
	var token = localStorage.getItem('token');

	if (categories != null) {
		localStorage.blog_categories = JSON.stringify(categories);
	}

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

	$scope.breadcrumb = {
		"main.home": "Главная",
		"main.blog": "Блог"
	}

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		$scope.need_navbar = false;
		if (toState.name == "main.blog.latest") {
			$scope.breadcrumb_active = "Новинки";
			$scope.need_navbar = true;
		}

		if (toState.name == "main.blog.best") {
			$scope.breadcrumb_active = "Лучшее";
			$scope.need_navbar = true;
		}

		if (toState.name == "main.blog.popular") {
			$scope.breadcrumb_active = "Популярное";
			$scope.need_navbar = true;
		}

		if (toState.name == "main.blog.addPost") {
			$scope.breadcrumb_active = "Новый пост";
		}

		if (toState.name == "main.blog.detailed") {
			var _title = $filter('filter')(blog, {id: parseInt(toParams.id)}, true)[0].title;
			var title = _title.slice(0, 16);
			title += _title.length > 16 ? '...' : '';
			$scope.breadcrumb_active = title;
		}

		if (toParams.cat_name) {
			for (var i = 0; i < $scope.cats.length; i++) {
				if ($scope.cats[i].name == toParams.cat_name) {
					$scope.selected_cat = i;
					$scope.apply_cat_filter(i);
					break;
				}
			}
		}
	});
});