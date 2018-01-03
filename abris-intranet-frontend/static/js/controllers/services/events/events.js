angular.module('myApp').controller('EventsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, events, companies, calendar_events) {
	if (events != null) {
		localStorage.events = JSON.stringify(events);
		calendar_events.set(events);
	} else {
		calendar_events.set(JSON.parse(localStorage.events));
	}

	$scope.breadcrumb = {
		"main.home": "Главная",
		"main.services": "Сервисы",
		"main.services.events": "Мероприятия"
	}

	$scope.comps = [{id: 0, name: "Организация"}].concat(companies);
	for (var i = 0; i < $scope.comps.length; i++) {
		$scope.comps[i].index = i;
	}
	$scope.selected_comp = 0;
	$scope.filterObj = {};
	var filtered_events = calendar_events.list;

	$scope.apply_comp_filter = function (val) {
		if (val == 0) {
			delete $scope.filterObj.company;
			filtered_events = calendar_events.list;
		} else {
			$scope.filterObj.company = $scope.comps[val].id;
			filtered_events = $filter('filter')(calendar_events.list, {company:$scope.comps[val].id}, true)
		}
		$('#calendar').fullCalendar('removeEvents');
		for (var i = 0; i < filtered_events.length; i++) {
			$('#calendar').fullCalendar('renderEvent', filtered_events[i], true);
		}
		add_hasEvent_class(filtered_events, calendar_events.list);
	};

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == "main.services.events.list") {
			$scope.breadcrumb_active = "Список";
			$scope.need_filter = true;
		}

		if (toState.name == "main.services.events.calendar") {
			$scope.breadcrumb_active = "Календарь";
			$scope.need_filter = true;
		}

		if (toState.name == "main.services.events.detail") {
			var _title = $filter('filter')(events, {id: toParams.id})[0].title;
			var title = _title.slice(0, 16);
			title += _title.length > 16 ? '...' : '';
			$scope.breadcrumb_active = title;
			$scope.need_filter = false;
		}

	});
});