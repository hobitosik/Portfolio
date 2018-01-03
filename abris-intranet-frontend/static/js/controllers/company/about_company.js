angular.module('myApp').controller('AboutCompanyCtrl',
function ($scope, $state, $http, $filter, jwtHelper, companies) {
	var token = localStorage.getItem('token');

	$scope.company_description = "";

	$scope.breadcrumb_active = "О компании";
	$scope.breadcrumb = {
		'main.home': 'Главная',
	};

	var map_src = "https://www.google.com/maps/embed/v1/place?key="+googleMapApiKey+"&q=";

	$scope.companies_arr = companies;

	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.company.about': 'О компании'
	};

	$scope.slide_index = 0;
	$scope.popup_slide = function (index) {
		$('#arcticmodal-company').arcticmodal();
		$scope.slide_index = index;
	}
	$scope.next_slide = function () {
		if ($scope.slide_index == ($scope.slider_images.length - 1)) {
			$scope.slide_index = 0;
		} else {
			$scope.slide_index++;
		}
	}
	$scope.prev_slide = function () {
		if ($scope.slide_index == 0) {
			$scope.slide_index = $scope.slider_images.length - 1;
		} else {
			$scope.slide_index--;
		}
	}

	$scope.switch_company = function (num) {
		if (!companies) {
			return;
		};
		var thisCompany = $filter('filter')($scope.companies_arr, {"id": parseInt(num)}, true)[0];
		
		if (thisCompany == undefined) {
			thisCompany = $scope.companies_arr[0];
			num = thisCompany.id;
		};

		$scope.company_active = num;

		$scope.company_description = thisCompany.description;
		$scope.company_mission = thisCompany.mission;
		$scope.company_valuables = thisCompany.valuables;
		$scope.slider_images = thisCompany.company_photos;

		$scope.map_src = map_src + thisCompany.latitude + ',' + thisCompany.longitude;

		$scope.breadcrumb_active = thisCompany.name;
	};

	if ($state.params.id == '') {
		$scope.switch_company($scope.companies_arr[0].id);
	} else {
		$scope.switch_company($state.params.id);
	};

	$scope.$on('ngRepeatFinished', function (event) {
		company_slider_script();
	});
});