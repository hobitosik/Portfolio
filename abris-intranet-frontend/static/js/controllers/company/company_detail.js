angular.module('myApp').controller('CompanyDetailCtrl',
function ($scope, $state, $http, $q, $filter, jwtHelper, company_instanse) {
	if (company_instanse === null) {
		$state.go('main.company.structure');
	};
	var token = localStorage.getItem('token');
	
	$scope.my_company = company_instanse;

	$scope.breadcrumb_active = $scope.my_company.name;
	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.company.structure': 'Структура компании'
	};

	var departments = undefined;
	var positions = undefined;

	function get_positions() {
		return $http.get(api + 'positions/').then(function (resp) {
			return resp["data"]
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function get_departments() {
		return $http.get(api + 'departments/').then(function (resp) {
			return resp["data"]
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	$q.all([get_departments(), get_positions()]).then(function (resp) {
		departments = resp[0];
		positions = resp[1];

		fetch_data(departments, positions);
	});

	function fetch_data (departments, positions) {
		var this_departments = $filter('filter')(departments, {"company":{"id": $scope.my_company.id}}, true);

		$scope.my_departments = [];
		this_departments.forEach(function (value, index, array) {
			value["head"]["position"] = $filter('filter')(positions, {"user":{"id": value["head"]["id"]}}, true)[0];
			
			value["employees"].forEach(function (value1, index1, array1) {
				value1["position"] = $filter('filter')(positions, {"user":{"id": value1["id"]}}, true)[0];
			});

			var my_departament = {
				name: value["name"],
				head: value["head"],
				employees: value["employees"],
				emp_count: value["employees"].length,
				ordering: value["ordering"]
			};

			$scope.my_departments.push(my_departament);
		});

		$scope.$on('ngRepeatFinished', function (event) {
			companyDetailScript();
		});
	}
});