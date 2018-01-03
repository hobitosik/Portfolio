angular.module('myApp').controller('AdsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, adverts, companies, vote, favorites) {
	var token = localStorage.getItem('token');
	console.log(adverts);

	adverts.results.forEach(function (value, index, array) {
		value.isFavorite = favorites.isFavorite(value, 'post');
	});

	$scope.need_breadcrumb = false;

	if ($state.includes('main.company')) {
		$scope.need_breadcrumb = true;
		$scope.breadcrumb_active = "Объявления";
		$scope.breadcrumb = {
			'main.home': 'Главная',
			'main.company': 'Компания'
		};
	};

	$scope.$watch('filter_company', function (newValue, oldValue) {
		fetch_filters();
		if (newValue == '-1') {
			$scope.current_company = "Организация";
		} else {
			$scope.current_company = $scope.companies_list[newValue];
		}
	});

	$scope.filter_company = "-1";
	$scope.companies_list = [];
	companies.forEach(function (value, index, array) {
		$scope.companies_list.push(value.name);
	});

	function fetch_filters () {
		if ($scope.filter_company == "-1") {
			$scope.activity_data = adverts.results;
			$scope.activity_data = $filter('orderBy')($scope.activity_data, '-added');

			$scope.announce_text = [];
			$scope.activity_data.forEach(function (value, index, array) {
				var no_tags = $filter('limitHtml')(value.text, 512);
				$scope.announce_text.push(no_tags);
			});
			return;
		};

		var num = parseInt($scope.filter_company);
		var comp_id = companies[num]["id"];
		$scope.activity_data = $filter('filter')(adverts.results, {"company": comp_id}, true);

		$scope.activity_data = $filter('orderBy')($scope.activity_data, '-added');

		$scope.announce_text = [];
		$scope.activity_data.forEach(function (value, index, array) {
			var no_tags = $filter('limitHtml')(value.text, 512);
			$scope.announce_text.push(no_tags);
		});
	}

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

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!adverts.next) {
				return;
			}
			$http.get(adverts.next).then(function (resp) {
				adverts.next = resp["data"]["next"];
				adverts.previous = resp["data"]["previous"];
				adverts.count = resp["data"]["count"];

				resp["data"]["results"].forEach(function (value, index, array) {
					value.isFavorite = favorites.isFavorite(value, 'post');
				});

				adverts.results = adverts.results.concat(resp["data"]["results"]);

				fetch_filters();
				this.disabled = false;
			}, function (resp) {
				console.log(resp);
				adverts.next = null;
			});
		}
	}
});