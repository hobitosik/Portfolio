angular.module('myApp').controller('CompanyStructureCtrl',
function ($scope, $state, $http, jwtHelper, companies) {
	var token = localStorage.getItem('token');
	
	$scope.breadcrumb_active = "Структура компании";
	$scope.breadcrumb = {
		'main.home': 'Главная',
	};

	var companies_list = companies;
	var subsidiaries = [];
	var partners = [];
	$scope.subsidiaries_info = [];
	$scope.partners_info = [];

	companies_list.forEach(function (value, index, array) {
		if (value.rel_type == "subsidiary") {
			subsidiaries.push(value);
		} else if (value.rel_type == "partner") {
			partners.push(value);
		} else {
			$scope.main_company = {
				id: value.id,
				name: value.name,
				main_country: "",
				countries: "",
				logo: value.logo
			};

			if (value.main_country != null) {
				$scope.main_company.main_country = (value.main_country).split(',')[0];
			}
		}
	});

	subsidiaries.forEach(function (value, index, array) {
		var obj = {
			id: value.id,
			name: value.name,
			main_country: "",
			countries: "",
			logo: value.logo
		}

		if (value.main_country != null) {
			obj.main_country = (value.main_country).split(',')[0];
		}
		
		value.countries.forEach(function (value1, index1, array1) {
			var str = value1.split(",")[0];

			obj.countries += str + "\n";
		});

		$scope.subsidiaries_info.push(obj);
	});

	partners.forEach(function (value, index, array) {
		var obj = {
			id: value.id,
			name: value.name,
			main_country: "",
			countries: "",
			logo: value.logo
		}

		if (value.main_country != null) {
			obj.main_country = (value.main_country).split(',')[0];
		}
		
		value.countries.forEach(function (value1, index1, array1) {
			var str = value1.split(",")[0];

			obj.countries += str + "\n";
		});

		$scope.partners_info.push(obj);
	});

	$scope.$on('ngRepeatFinished', function (event) {
		companyStructureScript();
	});
});