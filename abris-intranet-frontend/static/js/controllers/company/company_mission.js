angular.module('myApp').controller('CompanyMissionCtrl',
function ($scope, $state, $http, jwtHelper) {
	var token = localStorage.getItem('token');

	$scope.breadcrumb_active = "Миссия и ценности";
	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.company.about': "О компании"
	};

	$http.get(api + 'pages/1/').then(function (resp) {
		$scope.title = resp["data"].title;
		$scope.text = resp["data"].text;
	}, function (resp) {
		console.log(resp);
	});
});