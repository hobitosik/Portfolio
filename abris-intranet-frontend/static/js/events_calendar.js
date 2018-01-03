function add_hasEvent_class(elemId, events, removeClassEvents, className) {
	var class_name = className || 'hasEvent';
		if (removeClassEvents) {
			for (var i = 0; i < removeClassEvents.length; i++) {
			    var evStartDate = new Date(removeClassEvents[i].start),
			        evFinishDate = new Date(removeClassEvents[i].end);
			    if (removeClassEvents[i].end) {
			        while (evStartDate <= evFinishDate) {
			            removeClassByDate(evStartDate);
			            evStartDate.setDate(evStartDate.getDate() + 1);
			        }
			    } else {
			        removeClassByDate(evStartDate);
			    }
			}
		}

		for (var i = 0; i < events.length; i++) {
		    var evStartDate = new Date(events[i].start),
		        evFinishDate = new Date(events[i].end);
		    if (events[i].end) {
		        while (evStartDate <= evFinishDate) {
		            addClassByDate(evStartDate);
		            evStartDate.setDate(evStartDate.getDate() + 1);
		        }
		    } else {
		        addClassByDate(evStartDate);
		    }
		}

		function addClassByDate(date) {
		    var dataAttr = getDataAttr(date);
		    $("#"+elemId+" [data-date='" + dataAttr + "']").addClass(class_name);
		}

		function removeClassByDate(date) {
		    var dataAttr = getDataAttr(date);
		    $("#"+elemId+" [data-date='" + dataAttr + "']").removeClass(class_name);
		}

		function getDataAttr(date) {
			return date.getFullYear() + "-" + ((date.getMonth()+1).toString().length === 2 ? (date.getMonth()+1) : "0" + (date.getMonth()+1)) + "-" + (date.getDate().toString().length === 2 ? date.getDate() : "0" + date.getDate()); 
		};
}

function eventsCalendarScript(lang, list, $http, elemId) {
	if(list == undefined) {
		return;
	}

		$("body").bind('click', function(e){
			var isEvent = $(e.target).hasClass('fc-event');
			isEvent = isEvent || $(e.target).parent().hasClass('fc-event');
			isEvent = isEvent || $(e.target).parent().parent().hasClass('fc-event');

			var isCalendarTooltip = $(e.target).hasClass('calendar-tooltip');
			isCalendarTooltip = isCalendarTooltip || $(e.target).parent().hasClass('calendar-tooltip');
			isCalendarTooltip = isCalendarTooltip || $(e.target).parent().parent().hasClass('calendar-tooltip');
			isCalendarTooltip = isCalendarTooltip || $(e.target).parent().parent().parent().hasClass('calendar-tooltip');

			if (!isEvent && !isCalendarTooltip) {
				$(".calendar-tooltip").remove();
			}
		});

		

		$('#' + elemId).fullCalendar({
			header: {
				left: '',
				center: 'title,prev,next',
				right: ''
			},
			lang: lang,
			eventLimit: true, // allow "more" link when too many events
			events: list,
			viewRender: setMonthNameToTheFirstDay,
			eventAfterAllRender: function () {
				$("#"+elemId+" .fc-event-container").css("cursor", "pointer");
			},
			eventClick: function(calEvent, jsEvent, view) {
		        $(".calendar-tooltip").remove();

		        if (elemId == 'calendar') {
		        	var item = $('<div class="calendar-tooltip">'+
			        	'<div class="body-tooltip rel">'+
			        		'<h2><a href="'+calEvent.href+'">'+calEvent.title+'</a></h2>'+
			        		'<div class="time-event">'+calEvent.date+'</div>'+
			        		'<div class="actions-event abs invited">'+
			        			'<a href="" id="accept-the-invitation">'+_('Подтвердить')+'</a><a href="" id="decline-the-invitation">'+_('Отклонить')+'</a>'+
			        		'</div>'+
			        		'<div class="actions-event abs accepted">'+
			        			'<span>'+_('Вы подтвердили участие')+'</span>'+
			        		'</div>'+
			        		'<div class="actions-event abs declined">'+
			        			'<span>'+_('Вы отклонили приглашение')+'</span>'+
			        		'</div>'+
			        	'</div></div>');
			        $(jsEvent.currentTarget).parent().append(item);
			        if (!calEvent.invited) {
			        	$(".actions-event.abs.invited").remove();
			        } 
			        if (!calEvent.accepted) {
			        	$(".actions-event.abs.accepted").remove();
			        }
			        if (!calEvent.declined) {
			        	$(".actions-event.abs.declined").remove();
			        }

			        $("#accept-the-invitation").bind('click', function (e) {
						$http.post(api + 'event/' + calEvent.id + '/accept/').then(function (resp) {
							$("#accept-the-invitation").parent().html('<span>'+_('Вы подтвердили участие')+'</span>');
						}, function (resp) {
							console.log(resp);
						});
					});
					$("#decline-the-invitation").bind('click', function (e) {
						$http.post(api + 'event/' + calEvent.id + '/decline/').then(function (resp) {
							$("#decline-the-invitation").parent().html('<span>'+_('Вы отклонили приглашение')+'</span>');
						}, function (resp) {
							console.log(resp);
						});
					});
		        } else {
		        	profile_popup_event(calEvent, jsEvent);
		        }
		        
		    }
		});
		add_hasEvent_class(elemId, list);

		function setMonthNameToTheFirstDay() {
			for (var i = 1; i < 10; i++) {
				$('#' + elemId + " [data-date*='0"+ i +"-01'].fc-day-number").each(function (index, elem) {
					$(this).html(moment('0'+ i + '-01', 'MM-DD').format('D MMMM'));
				});
			}

			for (var i = 10; i <= 12; i++) {
				$('#' + elemId + " [data-date*='"+ i +"-01'].fc-day-number").each(function (index, elem) {
					$(this).html(moment(i + '-01', 'MM-DD').format('D MMMM'));
				});
			}
			
			add_hasEvent_class(elemId, $('#' + elemId).fullCalendar('clientEvents'), list);
		}

		function profile_popup_event (calEvent, jsEvent) {
			$(".calendar-tooltip").remove();
		        var item = $('<div class="calendar-tooltip">'+
		        	'<div class="body-tooltip rel">'+
		        		'<h2><a href="'+calEvent.href+'">'+calEvent.title+'</a></h2>'+
		        		'<div class="time-event">'+calEvent.date+'</div>'+
		        		'<div class="actions-event abs invited">'+
		        			'<span>'+_('Приглашен(а)')+'</span>'+
		        		'</div>'+
		        		'<div class="actions-event abs accepted">'+
		        			'<span>'+_('Пойдет')+'</span>'+
		        		'</div>'+
		        		'<div class="actions-event abs declined">'+
		        			'<span>'+_('Отклонил(а) приглашение')+'</span>'+
		        		'</div>'+
		        	'</div></div>');
		        $(jsEvent.currentTarget).parent().append(item);
		        if (!calEvent.invited) {
		        	$(".actions-event.abs.invited").remove();
		        } 
		        if (!calEvent.accepted) {
		        	$(".actions-event.abs.accepted").remove();
		        }
		        if (!calEvent.declined) {
		        	$(".actions-event.abs.declined").remove();
		        }
		}
};