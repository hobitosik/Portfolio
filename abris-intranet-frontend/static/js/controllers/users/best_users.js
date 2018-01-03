angular.module('myApp').controller('BestUsersCtrl',
function ($scope, $state, $http, $q, $filter, jwtHelper, vote) {
	var token = localStorage.getItem('token');

	$scope.breadcrumb_active = "Лучшие сотрудники";
	$scope.breadcrumb = {
		"main.home": "Главная",
		"main.users": "Сотрудники"
	}

	$scope.filter = {
		company: "-1",
		quarter: "-1",
		month: "-1",
		year: "-1"
	}

	$scope.companies = [];

	$scope.years = [];
	var thisYear = parseInt(moment().format("YYYY"));
	for (i = 2014; i <= thisYear; i++) {
		$scope.years.push(i);
	}

	function get_best_users () {
		return $http.get(api + 'bestemployee/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function get_companies () {
		return $http.get(api + 'companies/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function get_departments () {
		return $http.get(api + 'departments/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	var best_users;
	var companies;
	var departments;
	$q.all([get_best_users(), get_companies(), get_departments()]).then(function (data) {
		best_users = data[0];
		companies = data[1];
		departments = data[2];

		fetch_data(best_users, departments, companies);

		companies.forEach(function (value, index, array) {
			$scope.companies.push(value["name"]);
		});
	});

	function fetch_data (best_users, deps, comps) {
		if (!best_users) {
			return;
		}
		$scope.best_users = [];
		best_users.forEach(function (value, index, array) {
			var dep = $filter('filter')(deps, {"employees": {"id": value["user"]["id"]}}, true);
			if (dep.length == 0) {
				dep = $filter('filter')(deps, {"head": {"id": value["user"]["id"]}}, true);
			}

			var company;
			if (dep.length != 0) {
				company = dep[0]["company"]["name"];
			} else {
				company = "";
			}

			var text = value["text"].slice(0, 255);
			if (text.length < value["text"]) {
				text += "...";
			}

			var user = value.user.profile;
			if (user) {
				var obj = {
					id: value["id"],
					name: user["first_name"] + " " + user["last_name"] + " " + user["middle_name"],
					announce_text: text,
					title: value["title"],
					photo: user["photo"],
					company: company,
					type: value["best_employee_type"],
					added: value["added"],
					date: moment(value["date"], 'YYYY-MM-DD').format("DD.MM.YYYY"),
					hits: value.hits,
					replies: value.replies,
					upvotes: value.upvotes,
					downvotes: value.downvotes
				}

				if ($scope.filter.company != "-1") {
					var c = parseInt($scope.filter.company);
					if (obj.company != $scope.companies[c]) {
						return;
					}
				}

				if ($scope.filter.year != "-1") {
					var y = parseInt($scope.filter.year);
					if (obj.date.split(".")[2] != y) {
						return;
					}
				}

				if ($scope.filter.month != "-1") {
					var m = parseInt($scope.filter.month);
					if (obj.date.split(".")[1] != m || obj.type != "month") {
						return;
					}
				}

				if ($scope.filter.quarter != "-1") {
					var q = parseInt($scope.filter.quarter);
					var mm = parseInt(obj.date.split(".")[1]);
					var qq = mm > 3 * (q - 1) && mm <= 3 * q;
					if (!qq || obj.type != "quarter") {
						return;
					}
				}

				$scope.best_users.push(obj);
			}
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

	$scope.months = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь"
	];
	$scope.quarters = [
		"Первый",
		"Второй",
		"Третий",
		"Четвертый"
	];

	$scope.current = {
		company: "Организация",
		year: "Год",
		quater: "Квартал",
		month: "Месяц"
	}

	$scope.$watchGroup(['filter.company', 'filter.year', 'filter.quarter', 'filter.month'], function (newValues, oldValues) {
		fetch_data(best_users, departments, companies);
		
		if (newValues[0] == "-1") {
			$scope.current.company = "Организация";
		} else {
			$scope.current.company = $scope.companies[newValues[0]];
		}

		if (newValues[1] == "-1") {
			$scope.current.year = "Год";
		} else {
			$scope.current.year = newValues[1];
		}

		if (newValues[2] == "-1") {
			$scope.current.quarter = "Квартал";
		} else {
			$scope.current.quarter = $scope.quarters[parseInt(newValues[2]) - 1];
		}

		if (newValues[3] == "-1") {
			$scope.current.month = "Месяц";
		} else {
			$scope.current.month = $scope.months[parseInt(newValues[3]) - 1];;
		}
	});
});