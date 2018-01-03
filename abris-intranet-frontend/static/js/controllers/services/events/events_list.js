angular.module('myApp').controller('EventsListCtrl',
function ($scope, $state, $filter, $http, jwtHelper) {
	var id = jwtHelper.decodeToken(localStorage.getItem('token'))["user_id"];
	var events = JSON.parse(localStorage.events);
	
	$scope.events = [];
	var _events = [];
	events.forEach(function (value, index, array) {
		var _text = strip_html(value.text);
		var text = _text.slice(0, 100);
		if (_text.length > text.length) {
			text += '...';
		}
		var isInvited = $filter('filter')(value.invitations, {id:id}, true).length > 0;
		var hasAccepted = $filter('filter')(value.invitations_accepted, {id:id}, true).length > 0;
		var hasDeclined = $filter('filter')(value.invitations_declined, {id:id}, true).length > 0;

		var obj = {
			id: value.id,
			title: value.title,
			text: text,
			day: moment(value.date).format('dddd DD MMMM YYYY'),
			time: moment(value.date).format('HH:mm'),
			date: value.date,
			accepted: hasAccepted,
			invited: isInvited,
			declined: hasDeclined,
			company: value.company,
			image: value.image
		}
		if (value.time_zone != null) {
			obj.time = moment.tz(value.date.replace("Z", ""), value.time_zone).format('HH:mm');
		}

		_events.push(obj);
	});

	_events = $filter('orderBy')(_events, '+date');

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_events.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.events.push(_events.pop());
				if (!_events.length) {
					return;
				}
			}
			this.disabled = false;
		}
	}

	$scope.accept = function (index) {
		$http.post(api + 'event/' + $scope.events[index].id + '/accept/').then(function (resp) {
			$scope.events[index].declined = false;
			$scope.events[index].accepted = true;
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.decline = function (index) {
		$http.post(api + 'event/' + $scope.events[index].id + '/decline/').then(function (resp) {
			$scope.events[index].accepted = false;
			$scope.events[index].declined = true;
		}, function (resp) {
			console.log(resp);
		});
	}
});