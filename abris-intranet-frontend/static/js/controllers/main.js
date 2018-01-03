angular.module('myApp').controller('MainCtrl',
function ($scope, $rootScope, $state, jwtHelper, FetchNumbers, $sce) {
	$rootScope.$on('$stateChangeStart',
	function (event, toState, toParams, fromState, fromParams) {
		var token = localStorage.getItem('token');
		if (toState.name != "login") {
			$("body").css("background-image", "");
		}

		if (token == undefined || jwtHelper.isTokenExpired(token)) {
			if (toState.name != 'login') {
				event.preventDefault();
				$state.go('login');
			};
		} else {
			if (toState.name == 'login') {
				event.preventDefault();
				$state.go('main.home');
			};
		};
	});

	$state.go('main.home');

	$scope.bodyClasses = '';
	$scope.sectionMainClasses = '';
	$scope.title = '';

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (!($state.includes("main.media") && toParams.id)) {
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}

	    if (angular.isDefined(toState.data.bodyClasses)) {
	        $scope.bodyClasses = toState.data.bodyClasses;
	    } else {
	    	$scope.bodyClasses = '';
	    }

	    if (angular.isDefined(toState.data.title)) {
	        $scope.title = toState.data.title;
	    } else {
	    	$scope.title = '';
	    }

	    if (toState.name == "main.home") {
	    	$state.go("main.home.activity");
	    };

	    if (toState.name == "main.company" || toState.name == "main.company.about") {
	    	$state.go("main.company.about.instance");
	    };

	    if (toState.name == "main.users") {
	    	$state.go("main.users.list");
	    };

	    if (toState.name == "main.services" || toState.name == "main.services.events") {
	    	$state.go("main.services.events.list");
	    };

	    if (toState.name == "main.blog") {
	    	$state.go("main.blog.latest");
	    };

	    if (toState.name == "main.base" || toState.name == "main.base.nav") {
	    	$state.go("main.base.nav.structure");
	    };
	});

	$scope.logout = function () {
		localStorage.removeItem('token');
		$state.go('login');
	};

	$scope.translate = _;

	$scope.transform_if_gt999 = FetchNumbers.transform;

	$scope.filesHost = 'uploads/';
	// $scope.filesHost = 'https://192.168.132.41/uploads/';

	$scope.trustAsHtml = function (data) {
		return $sce.trustAsHtml(data);
	}
});
//=====================================================================================
angular.module('myApp').controller('AuthCtrl',
function ($scope, $http, $state, jwtHelper, lang_code, background, icons) {
	var token = localStorage.getItem('token');
	lang_code.set_locale_to((window.navigator.userLanguage || window.navigator.language).split('-')[0]);

	$scope.icons = icons;
	if (background) {
		$("body").css("background-image", "url('uploads/" + background.login_background + "')");
	}

	$scope.invalidUser = false;

	$scope.login = function () {
		var data = {
			'username': $scope.username,
			'password': $scope.password
		};

		$http.post(api + 'auth/token/', data, {skipAuthorization: true}).then(
		function (resp) {
			token = resp['data']['token'];

			$scope.invalidUser = false;

			localStorage.setItem('token', token);
			$state.go('main.home');
		},
		function (arg) {
			$scope.invalidUser = true;
			$scope.password = '';
			console.log(arg);
		});
	};
});
//=====================================================================================
angular.module('myApp').controller('MainContainerCtrl',
function ($scope, $state, $http, $filter, jwtHelper, $rootScope, favorites, lang_code, $window) {
	var token = localStorage.getItem('token');

	$scope.categories = [
		"Все разделы", // 0 +
		"Компании", // 1 +
		"Сотрудники", // 2 +
		"Новости", // 3 +
		"Объявления", // 4 +
		"Поздравления", // 5 +
		"Вакансии", // 6 +
		"Мероприятия", // 7 +
		"Опросы", // 8 +
		"Аукцион", // 9 +
		"База знаний", // 10 +
		"Фотографии", // 11 +
		"Видео", // 12 +
		"Блог" // 13 +
	]

	$scope.$watch('category_num', function () {
		$scope.current_cat = $scope.categories[$scope.category_num];
	});

	$scope.category_num = "0";

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		$scope.searchQuery = '';

		if ($state.includes("main.company")) {
			$scope.category_num = "1";
			return;
		};

		if ($state.includes("main.users.vacancies") || $state.includes("main.users.vacancy_detailed")) {
			$scope.category_num = "6";
			return;
		};

		if ($state.includes("main.users")) {
			$scope.category_num = "2";
			return;
		};

		if ($state.includes("main.home.news")) {
			$scope.category_num = "3";
			return;
		};

		if ($state.includes("main.home.ads")) {
			$scope.category_num = "4";
			return;
		};

		if ($state.includes("main.home.congrats")) {
			$scope.category_num = "5";
			return;
		};

		if ($state.includes("main.services.events")) {
			$scope.category_num = "7";
			return;
		};

		if ($state.includes("main.services.polls")) {
			$scope.category_num = "8";
			return;
		};

		if ($state.includes("main.services.auction")) {
			$scope.category_num = "9";
			return;
		};

		if ($state.includes("main.base")) {
			$scope.category_num = "10";
			return;
		};

		if ($state.includes("main.media.photo") || $state.includes("main.home.media.photo")) {
			$scope.category_num = "11";
			return;
		};

		if ($state.includes("main.media.video") || $state.includes("main.home.media.video")) {
			$scope.category_num = "12";
			return;
		};

		if ($state.includes("main.blog") || $state.includes("main.home.blog")) {
			$scope.category_num = "13";
			return;
		};

		$scope.category_num = "0";
	});

	var decodedToken = jwtHelper.decodeToken(token);

	$scope.my_id = decodedToken["user_id"];
	$scope.my_username = decodedToken['username'].split('@')[0];

	$scope.languages = {
		list: {
			'ru': 'Ru',
			'en': 'En'
		},
		current: 'en'
	}

	if (localStorage.lang_code) {
		$scope.languages.current = lang_code.set_locale_to(localStorage.lang_code);
	} else {
		$scope.languages.current = lang_code.set_locale_to((window.navigator.userLanguage || window.navigator.language).split('-')[0]);
	}

	$scope.set_language = function (lang) {
		if (lang == $scope.languages.current) {
			return;
		}
		$scope.languages.current = lang_code.set_locale_to(lang);

		localStorage.lang_code = lang_code.get_locale();
		$window.location.reload();

	}

	$scope.notifications = [];
	set_notif();
	function set_notif () {
		$http.get(api + 'profiles/get_notifications/').then(function (resp) {
			// console.log(resp["data"]);
			parse_notifications(resp["data"]);
		}, function (resp) {
			console.log(resp);
		});
	}

	function parse_notifications (data) {
		$scope.notifications = [];
		data.forEach(function (value, index) {
			if (!value.content_object) {
				return;
			}
			var obj = {
				id: value.id,
				object_id: value.object_id,
				image: value.content_object.image || value.content_object.photo,
				path: value.path,
				title: '',
				viewed: value.viewed,
				date: moment(value.created).format('DD.MM.YYYY'),
				onClick: function () {
					var route = '';
					$http.delete(api + 'profiles/get_notifications/?id=' + this.id).then(function (resp) {
						console.log("deleted");
						console.log(resp);
						set_notif();
					}, function (err) {
						console.log(err);
					});
					switch (this.path) {
						case 'event':
							route = 'main.services.events.detail';
						break;

						case 'poll':
							route = 'main.services.polls.detail';
						break;

						default:
							return;
					}
					$state.go(route, {id: this.object_id});
				}
			};

			switch (value.action + ' ' + value.path) {
				// event
				case 'new event':
					obj.title = 'Создано новое мероприятие';
				break;

				case 'updated event':
					obj.title = 'Мероприятие было обновлено';
				break;

				case 'deleted event':
					obj.title = 'Мероприятие было удалено';
				break;

				case 'invited event':
					obj.title = 'Вы приглашены на мероприятие';
				break;

				case 'declined event':
					obj.title = 'Мероприятие отменено';
				break;
				// poll
				case 'new poll':
					obj.title = 'Создан новый опрос';
				break;

				case 'updated poll':
					obj.title = 'Опрос был обновлен';
				break;

				case 'deleted poll':
					obj.title = 'Опрос был удален';
				break;

				case 'invited poll':
					obj.title = 'Вас пригласили пройти опрос';
				break;

				case 'declined poll':
					obj.title = 'Опрос отменен';
				break;

				default:
					return;
				break;
			}
			$scope.notifications.push(obj);
		});
	}

	$http.get(api + "users/" + decodedToken['user_id'] + '/').then(function (resp) {
		var data = resp["data"];
		if (data.profile) {
			favorites.set_prof_id(data.profile.id);
			$scope.my_photo = data.profile.photo;
			$scope.my_username = data.profile.first_name;
		}
	}, function (resp) {
		console.log(resp);
	});

	$scope.$on('avatar.changed', function (event, value) {
		$scope.my_photo = value;
	});

	$scope.toggleFavorites = function (favored, path) {
		if (!favored.isFavorite) {
			favorites.add(path + '/' + favored.id);
			favored.isFavorite = true;
		} else {
			favorites.remove(favored, path);
			favored.isFavorite = false;
		}
	};

	$scope.$on('fixImgHW', function () {
		lenta_img_w_h();
	});
});
