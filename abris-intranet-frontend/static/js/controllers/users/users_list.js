angular.module('myApp').controller('UsersListCtrl',
function ($scope, $state, $http, $q, $filter, jwtHelper) {
	var token = localStorage.getItem('token');

	$scope.breadcrumb_active = "Сотрудники";
	$scope.breadcrumb = {
		'main.home': 'Главная'
	};

	$scope.filter_company = "-1";
	$scope.filter_department = "-1";
	$scope.filter_position = "-1";
	$scope.filter_status = "-1";
	$scope.companies_list = [];
	$scope.departments_list = [];
	$scope.positions_list = [];


	$scope.predicate = 'first_name';
	$scope.sorting_by = 'first_name';
	$scope.reverse = false;

	$scope.sortBy = function (predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
		$scope.sorting_by = predicate;
	}

	$scope.statuses = [];
	function fetch_statuses (statuses) {
		statuses.forEach(function (value, index, array) {
			var obj = {
				id: value.id,
				color: value.color,
				name: value.name,
				element_id: 'status' + value.id + value.color
			}
			$scope.statuses.push(obj);
			var statusElem = '#list-users table .userpic#' + obj.element_id + ':after';
			var statusStyle = 'background: #' + obj.color + ';';
			try {
				document.styleSheets[0].addRule(statusElem, statusStyle);
			} catch (err) {
				var rule = statusElem + '{' + statusStyle + '}';
				addStylesheetRule(rule);
			}
		});
	}

	function build_users_array (users, positions, departments) {
		var data = [];
		var user_companies = {};
		var user = undefined;
		var posit = undefined;
		var depart = undefined;

		users.forEach(function (value, index, array) {
			if (!value.profile) {
				return;
			}
			user = value.profile;

			posit = $filter('filter')(positions, {"user": {"id": value["id"]}}, true)[0];
			if (posit == undefined) {
				posit = {
					"name": ""
				}
			};

			depart = $filter('filter')(departments, {"head":{"id": value["id"]}}, true)[0];
			if (depart == undefined) {
				depart = $filter('filter')(departments, {"employees":{"id": value["id"]}}, true)[0];

				if (depart == undefined) {
					depart = {
						"company": {
							"name": ""
						}
					}
				};
			};

			var obj = {
				"id": value["id"],
				"first_name": user["first_name"],
				"middle_name": user["middle_name"],
				"last_name": user["last_name"],
				"position": posit["name"],
				"company": depart["company"]["name"] || "unknown",
				"department": depart["name"],
				"phone": user["phone"],
				"mobile_phone": user["mobile_phones"][0],
				"skype": user["skype"],
				"photo": user["photo"],
				"status": $filter('filter')($scope.statuses, {id:user["user_status"]}, true)[0]
			};

			if (obj.skype.length > 15) {
				obj.skype = obj.skype.slice(0,16) + '...';
			}
			
			var filtered_by_name = obj["first_name"] != "" || obj["last_name"] != "";
			var filtered_by_company = true;
			var filtered_by_department = true;
			var filtered_by_position = true;
			var filtered_by_status = true;

			if ($scope.filter_status != -1) {
				if (obj.status != undefined) {
					filtered_by_status = obj.status.id == $scope.statuses[$scope.filter_status].id;
				} else {
					filtered_by_status = false;
				}
			};

			if ($scope.filter_company != -1) {
				filtered_by_company = obj.company == $scope.companies_list[$scope.filter_company];
			};

			if ($scope.filter_department != -1) {
				filtered_by_department = obj.department == $scope.departments_list[$scope.filter_department];
			};

			if ($scope.filter_position != -1) {
				filtered_by_position = obj.position == $scope.positions_list[$scope.filter_position];
			};


			if (filtered_by_name && filtered_by_company && filtered_by_department && filtered_by_position && filtered_by_status) {
				data.push(obj);
				user_companies[obj.company] = obj.company;
			};
		});

		$scope.users_by_companies = split_by_user_companies(data, user_companies);
	}

	function split_by_user_companies (myUsers, user_companies) {
		var result = {};
		for (company in user_companies) {
			result[company] = $filter('filter')(myUsers, {"company": company}, true);
		}

		return result;
	}

	var users = undefined;
	var positions = undefined;
	var departments = undefined;
	var companies = undefined;
	var statuses = undefined;
	var data = [];

	function get_users () {
		return $http.get(api + 'users/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function get_positions () {
		return $http.get(api + 'positions/').then(function (resp) {
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

	function get_companies () {
		return $http.get(api + 'companies/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function get_statuses () {
		return $http.get(api + 'user_status/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		})
	}

	$q.all([get_users(), get_positions(), get_departments(), get_companies(), get_statuses()]).then(function (resp) {
		users = resp[0];
		positions = resp[1];
		departments = resp[2];
		companies = resp[3];
		statuses = resp[4];

		fetch_statuses(statuses);
		build_users_array(users, positions, departments);
		list_all_companies();
		list_all_departments();
		list_all_positions();
	});

	function list_all_companies () {
		$scope.companies_list = [];
		companies.forEach(function (value, index, array) {
			$scope.companies_list.push(value.name);
		});
	}

	function list_all_departments () {
		$scope.departments_list = [];

		var obj = {}; // to avoid dublicates
		departments.forEach(function (value, index, array) {
			obj[value.name] = index;
		});

		for (key in obj) {
			$scope.departments_list.push(key);
		};
	}

	function list_all_positions () {
		$scope.positions_list = [];
		
		var obj = {}; // to avoid dublicates
		positions.forEach(function (value, index, array) {
			obj[value.name] = index;
		});

		for (key in obj) {
			$scope.positions_list.push(key);
		};
	}

	$scope.clear_filters = function () {
		$scope.filter_company = "-1";
		$scope.filter_department = "-1";
		$scope.filter_position = "-1";
		$scope.filter_status = "-1";
		list_all_departments();
		list_all_positions();
	}

	$scope.$watch('filter_status', function (newValue, oldValue, scope) {
		if (newValue == "-1") {
			$scope.current_status = "Статус";
		} else {
			$scope.current_status = $scope.statuses[newValue].name;
		}

		if ($scope.statuses.length == 0) {
			return;
		};

		build_users_array(users, positions, departments);
	});

	$scope.$watch('filter_company', function (newValue, oldValue, scope) {
		if (newValue == "-1") {
			$scope.current_company = "Организация";
		} else {
			$scope.current_company = $scope.companies_list[newValue];
		}

		if (companies == undefined) {
			return;
		};

		$scope.filter_department = "-1";
		list_all_departments();
		$scope.filter_position = "-1";
		list_all_positions();

		if (newValue != -1) {
			$scope.departments_list = [];
			departments.forEach(function (value, index, array) {
				if (value.company.id == companies[newValue]["id"]) {
					$scope.departments_list.push(value.name);
				};
			});
		};

		build_users_array(users, positions, departments);
	});

	$scope.$watch('filter_department', function (newValue, oldValue, scope) {
		if (newValue == "-1") {
			$scope.current_department = "Отдел";
		} else {
			$scope.current_department = $scope.departments_list[newValue];
		}

		if (companies == undefined) {
			return;
		};

		$scope.filter_position = "-1";
		list_all_positions();

		if (newValue != -1) {
			$scope.positions_list = [];

			var obj = {};
			positions.forEach(function (value, index, array) {
				if (value.department == departments[newValue]["id"]) {
					obj[value.name] = index;
				};
			});

			for (key in obj) {
				$scope.positions_list.push(key);
			};
		};

		build_users_array(users, positions, departments);
	});

	$scope.$watch('filter_position', function (newValue, oldValue, scope) {
		if (newValue == "-1") {
			$scope.current_position = "Должность";
		} else {
			$scope.current_position = $scope.positions_list[newValue];
		}

		if (companies == undefined) {
			return;
		};

		build_users_array(users, positions, departments);
	});
});