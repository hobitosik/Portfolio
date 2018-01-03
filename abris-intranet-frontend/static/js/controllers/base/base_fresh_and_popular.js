angular.module('myApp').controller('BaseFreshCtrl',
function ($scope, $state, $http, $filter, jwtHelper, articles) {
	var token = localStorage.getItem('token');

	$scope.articles = $filter('orderBy')(articles, '-added');

	localStorage.setItem('freshArticles', JSON.stringify($scope.articles));
});

angular.module('myApp').controller('BasePopularCtrl',
function ($scope, $state, $http, $filter, jwtHelper, articles) {
	var token = localStorage.getItem('token');

	$scope.articles = $filter('orderBy')(articles, '-hits');

	localStorage.setItem('popularArticles', JSON.stringify($scope.articles));
});