angular.module('myApp').controller('VacanciesCtrl',
function ($scope, $state, $http, $filter, jwtHelper, vacancies, companies, vote) {
	var token = localStorage.getItem('token');

	$scope.breadcrumb_active = "Вакансии";
	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.users.list': 'Сотрудники'
	}

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
			$scope.activity_data = vacancies.results;
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
		$scope.activity_data = $filter('filter')(vacancies.results, {"company": comp_id}, true);

		$scope.activity_data = $filter('orderBy')($scope.activity_data, '-added');

		$scope.announce_text = [];
		$scope.activity_data.forEach(function (value, index, array) {
			var no_tags = $filter('limitHtml')(value.text, 512);
			$scope.announce_text.push(no_tags);
		});
	}

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!vacancies.next) {
				return;
			}
			$http.get(vacancies.next).then(function (resp) {
				vacancies.next = resp["data"]["next"];
				vacancies.previous = resp["data"]["previous"];
				vacancies.count = resp["data"]["count"];
				vacancies.results = vacancies.results.concat(resp["data"]["results"]);

				fetch_filters();
				this.disabled = false;
			}, function (resp) {
				console.log(resp);
				vacancies.next = null;
			});
		}
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
});