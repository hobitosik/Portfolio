angular.module('myApp').controller('BDayWidgetCtrl',
function ($scope, $rootScope, $http, $q, $state, jwtHelper) {
	$scope.show_bDays = false;

	function set_bDays (data) {
		if (!data || !data.length) {
			return;
		}

		data.forEach(function (value, index) {
			if (value.birth_date) {
				value.bDay = moment(value.birth_date).format("DD MMMM");
			}
		});

		$scope.show_bDays = true;
		$scope.bDays = data;
	}

	$http.get(api + 'profiles/birthdays/').then(function (resp) {
		set_bDays(resp.data);
	}, function (resp) {
		console.log(resp);
	});
});

angular.module('myApp').controller('BaseWidgetCtrl',
function ($scope, $rootScope, $http, $q, $state, jwtHelper) {
	$scope.show_base = false;

	var base_data;
	$http.get(api + 'wiki/').then(function (resp) {
		base_data = resp["data"];

		if ($state.includes("main.base")) {
			base_widget(base_data);
		}
	}, function (resp) {
		console.log(resp);
	});

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if ($state.includes("main.base")) {
			if (base_data) {
				base_widget(base_data);
			} else if (localStorage.wiki) {
				base_widget(JSON.parse(localStorage.wiki));
			}
		} else {
			$scope.show_base = false;
		}
	});

	function base_widget (wiki) {
		if ($scope.show_base) {
			return;
		}
		$scope.base_elems = [];
		wiki.forEach(function (value, index, array) {
			var obj = {
				name: value["name"],
				children: [],
				_children: value.children,
				articles: value.wiki_article_items,
				open: false,
				index_arr: [index],
				level: 0
			}

			$scope.base_elems.push(obj);
		});
		$scope.show_base = true;
	}

	$scope.open_folder = function (folder) {
		folder.open = !folder.open;
		if (folder._children.length == 0) {
			return;
		}

		folder.children = [];
		folder._children.forEach(function (value, index, array) {
			var index_arr = angular.copy(folder.index_arr);
			index_arr.push(index);
			var obj = {
				name: value["name"],
				children: [],
				_children: value.children,
				articles: value.wiki_article_items,
				open: false,
				index_arr: index_arr,
				level: folder.level + 1
			}

			folder.children.push(obj);
		});
	}
});

angular.module('myApp').controller('CalendarWidgetCtrl',
function ($scope, $rootScope, $http, lang_code, $state, jwtHelper, $compile, $filter, jwtHelper) {
	var events;
	$http.get(api + 'event/widget/').then(function (resp) {
		events = form_list(resp["data"]);
		setup_calendar(events);
	}, function (resp) {
		console.log(resp);
	});

	function dateHasEvent(date) {
		for (i = 0; i < events.length; i++) {
			if(moment(events[i].start).isSame(date, 'day')) {
				return events[i];
			}
		}
		return false;
	}

	function setup_calendar (events) {
		$("#calendar_widget").fullCalendar({
			header: {
				left: '',
				center: 'title,prev,next',
				right: ''
			},
			events: events,
			lang: lang_code.get_locale(),
			titleFormat: {
				month: 'MMMM YYYY',
				week: 'MMMM YYYY'
			},
			dayRender: function (date, cell) {
				var event = dateHasEvent(date);
				if (event) {
					var dataAttr = moment(date).format("YYYY-MM-DD");
					var color = null;
					if (event.accepted) {
						color = "#6EB75C";
					} else if (event.declined) {
						color = "#A2A2A2";
					} else {
						color = "#FF5266";
					}
					cell.css("background-color", color);
					$("#calendar_widget [data-date='" + dataAttr + "']").css("cursor", "pointer");
				}
			},
			eventAfterAllRender: function () {
				$("#calendar_widget .fc-event-container").hide();
			},
			dayClick: function (date) {
				var event = dateHasEvent(date);
				if (event) {
					$state.go('main.services.events.detail', {id: event.id});
				}
			}
		});

		var elem = $compile("<a class='viewMinificator'></a>")($scope);
		$("#calendar_widget .fc-toolbar .fc-center h2").wrap(elem);
	}

	function form_list (events) {
		var list = [];
		var elem;
		var token = jwtHelper.decodeToken(localStorage.token);
		// console.log(token);
		for (i = 0; i < events.length; i++) {
			elem = {
				id: events[i].id,
				start: new Date(events[i].date),
				title: events[i].title || events[i].name,
				date: moment(events[i].date).format('HH:mm'),
				accepted: $filter('filter')(events[i].invitations_accepted, {id:parseInt(token.user_id)}, true).length,
				declined: $filter('filter')(events[i].invitations_declined, {id:parseInt(token.user_id)}, true).length,
			}

			if (events[i].time_zone != null) {
				elem.date = moment.tz(events[i].date.replace("Z", ""), events[i].time_zone).format('HH:mm');
				elem.start = moment.tz(events[i].date.replace("Z", ""), events[i].time_zone).format();
			}
			list.push(elem);
		}

		return list;
	}
});

angular.module('myApp').controller('FavsWidgetCtrl',
function ($scope, $rootScope, $http, $q, $state, jwtHelper, favorites) {
	$scope.favs = [];
	favorites.get_prof_id().then(function (id) {
		$http.get(api + 'profiles/' + id + '/fav_widget/').then(function (resp) {
			set_favs_widget(resp["data"]);
		}, function (resp) {
			console.log(resp);
		});
	});

	function set_favs_widget (data) {
		data.forEach(function (value, index) {
			if (!value.content_object)
				return;

			var _title = value.content_object.title || value.content_object.name;
			var obj = {
				id: value.id,
				href: favorites.get_href(value),
				title: _title.slice(0, 32) + '...',
				image: value.content_object.image || value.content_object.photo,
				date: moment(value.content_object.added).format("DD.MM.YYYY")
			}

			$scope.favs.push(obj);
		});
	}

	$scope.$on('favsWidgetRender', function () {
		widget_favor_img_w_h();
	});

});

angular.module('myApp').controller('BestemployeeWidgetCtrl',
function ($scope, $http, $q, $state, jwtHelper, $filter) {
	$scope.bestUsers = [];

	$q.all([get_positions(), get_best_users()]).then(function (resp) {
		set_widget(resp[1], resp[0]);
	});

	function get_positions () {
		return $http.get(api + 'positions/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
		});
	}
	function get_best_users () {
		return $http.get(api + 'bestemployee/widget/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
		});
	}

	function set_widget (users, positions) {
		if (!users || !positions || (Array.isArray(users) && !users.length) || !users.user) {
			return;
		}

		if (Array.isArray(users)) {
			users.forEach(function (value, index) {
				var position = $filter('filter')(positions, {user: {id: parseInt(value.user.id)}}, true);
				if (!position.length || !value.user.profile)
					return;

				var obj = {
					id: value.id,
					user: value.user,
					position: position[0]
				}

				$scope.bestUsers.push(obj);
			});
		} else {
			var position = $filter('filter')(positions, {user: {id: parseInt(users.user.id)}}, true);
			if (!position.length || !users.user.profile)
				return;

			var obj = {
				id: users.id,
				user: users.user,
				position: position[0]
			}

			$scope.bestUsers.push(obj);
		}
	}
});

angular.module('myApp').controller('BlogWidgetCtrl',
function ($scope, $http, $q, $state, jwtHelper, $filter) {
	$scope.show_widget = false;

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if ($state.includes("main.blog")) {
			set_widget();
			$scope.show_widget = true;
		} else {
			$scope.show_widget = false;
		}
	});

	function set_widget () {
		$http.get(api + 'blog_categories/').then(function (resp) {
			$scope.cats = resp["data"];
		}, function (resp) {
			console.log(resp);
		});
	}
});
