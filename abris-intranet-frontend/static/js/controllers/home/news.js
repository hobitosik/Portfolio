angular.module('myApp').controller('NewsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, news, companies, vote, favorites) {
	var token = localStorage.getItem('token');
	console.log(news);

	news.results.forEach(function (value, index, array) {
		value.isFavorite = favorites.isFavorite(value, 'post');
	});

	$scope.need_breadcrumb = false;

	if ($state.includes('main.company')) {
		$scope.need_breadcrumb = true;
		$scope.breadcrumb_active = "Новости";
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
			$scope.activity_data = news.results;
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
		$scope.activity_data = $filter('filter')(news.results, {"company": comp_id}, true);

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
			if (!news.next) {
				return;
			}
			$http.get(news.next).then(function (resp) {
				console.log(resp.data);
				news.next = resp["data"]["next"];
				news.previous = resp["data"]["previous"];
				news.count = resp["data"]["count"];

				resp["data"]["results"].forEach(function (value, index, array) {
					value.isFavorite = favorites.isFavorite(value, 'post');
				});

				news.results = news.results.concat(resp["data"]["results"]);

				fetch_filters();
				this.disabled = false;
			}, function (resp) {
				console.log(resp);
				news.next = null;
			});
		}
	}
});