angular.module('myApp').controller('ProfileCalendarCtrl',
function ($scope, $state, $http, $filter, jwtHelper, user, events, lang_code) {
	var events_list = [];
	for (i = 0; i < events.length; i++) {
		var elem = {
			id: events[i].id,
			title: events[i].title,
			start: new Date(events[i].date),
			date: moment(events[i].date).format('HH:mm'),
			href: $state.href('main.services.events.detail', {id: events[i].id}),
			invited: false,
			accepted: false,
			declined: false,
			company: events[i].company
		}
		if (events[i].time_zone != null) {
			elem.date = moment.tz(events[i].date.replace("Z", ""), events[i].time_zone).format('HH:mm');
			elem.start = moment.tz(events[i].date.replace("Z", ""), events[i].time_zone).format();
		}
		var invited = $filter('filter')(events[i].invitations, { id: user.id }, true).length;
		var accepted = $filter('filter')(events[i].invitations_accepted, { id: user.id }, true).length;
		var declined = $filter('filter')(events[i].invitations_declined, { id: user.id }, true).length;
		if (invited) {
			elem.invited = true;
		}
		if (accepted) {
			elem.accepted = true;
		}
		if (declined) {
			elem.declined = true;
		}
		events_list.push(elem);
	}
	eventsCalendarScript(lang_code.get_locale(), events_list, $http, 'profileCalendar');
});