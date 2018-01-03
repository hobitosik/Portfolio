angular.module('myApp').controller('ProfileCtrl',
function ($scope, $state, $http, jwtHelper, user) {
	if (!user) {
		$state.go("main.home");
	}
	var token = localStorage.getItem('token');

	$scope.route_id = jwtHelper.decodeToken(token)['user_id'];
	var my_profile = $state.params.id == $scope.route_id;
	$scope.myProfile = my_profile;

	if (!my_profile) {
		$scope.route_id = $state.params.id;
	}

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == 'main.users.profile') {
			$state.go('main.users.profile.about');
		}

		if (toState.name == 'main.users.profile.about') {
			if (my_profile) {
				set_breadcrumb(null, 'Личный кабинет');
			} else {
				set_breadcrumb(null, user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name);
			}
		}

		if (toState.name == 'main.users.profile.articles') {
			var breadcrumbs = {};
			if (my_profile) {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			} else {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name;
			}
			set_breadcrumb(breadcrumbs, 'Публикации');
		}

		if (toState.name == 'main.users.profile.calendar') {
			var breadcrumbs = {};
			if (my_profile) {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			} else {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name;
			}
			set_breadcrumb(breadcrumbs, 'Календарь');
		}

		if (toState.name == 'main.users.profile.lots') {
			var breadcrumbs = {};
			if (my_profile) {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			} else {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name;
			}
			set_breadcrumb(breadcrumbs, 'Лоты');
		}

		if (toState.name == 'main.users.profile.editLot') {
			var breadcrumbs = {};
			if (my_profile) {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			} else {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name;
			}
			set_breadcrumb(breadcrumbs, 'Редактировать лот');
		}

		if (toState.name == 'main.users.profile.favorites') {
			var breadcrumbs = {};
			breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			
			set_breadcrumb(breadcrumbs, 'Избранное');
		}

		if (toState.name == 'main.users.profile.nominations') {
			var breadcrumbs = {};
			if (my_profile) {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = 'Личный кабинет';
			} else {
				breadcrumbs['main.users.profile({id:'+$scope.route_id+'})'] = user.profile.first_name + ' ' + user.profile.last_name + ' ' + user.profile.middle_name;
			}
			set_breadcrumb(breadcrumbs, 'Номинации');
		}
	});

	function set_breadcrumb (obj, active) {
		if (my_profile) {
			$scope.breadcrumb = {
				'main.home': 'Главная'
			};
		} else {
			$scope.breadcrumb = {
				'main.home': 'Главная',
				'main.users.list': 'Сотрудники'
			};
		}

		if (obj) {
			for (key in obj) {
				$scope.breadcrumb[key] = obj[key];
			}
		}

		$scope.breadcrumb_active = active;
	}
});