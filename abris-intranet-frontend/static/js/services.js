myApp.factory('favorites', function ($http, $filter, $q, $state) {
	var list = [];
	var prof_id = undefined;

	var items_to_check = [];

	function get_href (fav_obj) {
		if (fav_obj.path == 'post') {
			return $state.href('main.home.post', {id: fav_obj.object_id});
		}

		if (fav_obj.path == 'bestemployee') {
			return $state.href('main.users.bestDet', {id: fav_obj.object_id});
		}

		if (fav_obj.path == 'blog') {
			return $state.href('main.blog.detailed', {id: fav_obj.object_id});
		}

		if (fav_obj.path == 'event') {
			return $state.href('main.services.events.detail', {id: fav_obj.object_id});
		}

		if (fav_obj.path == 'wikiitem') {
			return $state.href('main.base.detailed', {id: fav_obj.object_id});
		}
	}

	function check_items () {
		items_to_check.forEach(function (value, index) {
			value.item.isFavorite = isFavorite(value.item, value.type);
		});
		items_to_check = [];
	}

	function set_list () {
		return $http.get(api + 'favorites/').then(function (resp) {
			// console.log(resp.data);
			if (!list.length && items_to_check.length) {
				list = resp["data"];
				check_items();
			}
			list = resp["data"];
		}, function (resp) {
			console.log(resp);
		});
	}

	function findFromList (item, type) {
		var filter_obj = {
			'path': type,
			'object_id': parseInt(item.id)
		}
		if (!list.length) {
			items_to_check.push({
				item: item,
				type: type
			});
			return null;
		}
		var res = $filter('filter')(list, filter_obj, true);
		if (res.length) {
			return res[0];
		}
		return null;
	}
	
	function getId (item, type) {
		var res = findFromList(item, type);
		if (res === null) {
			return null;
		}
		return res.id;
	}

	function isFavorite (item, type) {
		var found = findFromList(item, type);
		if (found === null) {
			return false;
		}
		return true;
	}

	function add (path) {
		if (path.split('/').length != 2) {
			return;
		}
		return $http.post(api + path + '/add_to_favorites/').then(function (resp) {
			set_list();
		}, function (resp) {
			console.log(resp);
		});
	}

	function remove (item, type) {
		var id = getId(item, type);
		if (id === null) {
			console.log('Item cannot be deleted from favorites, id is unknown');
			return;
		}
		$http.delete(api + 'favorites/' + id + '/').then(function (resp) {
			set_list();
		}, function (resp) {
			console.log(resp);
		});
	}

	function get () {
		return list;
	}

	var prof_id_promises = [];
	function get_prof_id () {
		var deffered = $q.defer();

		if (prof_id === undefined) {
			prof_id_promises.push(deffered);
		} else {
			deffered.resolve(prof_id);
		}

		return deffered.promise;
	}

	function set_prof_id (id) {
		prof_id = id;

		if (prof_id_promises.length) {
			for (i = 0; i < prof_id_promises.length; i++) {
				prof_id_promises[i].resolve(id);
			}
			prof_id_promises = [];
		}

		set_list();
	}

	return {
		set_prof_id: set_prof_id,
		get_prof_id: get_prof_id,
		get: get,
		add: add,
		remove: remove,
		isFavorite: isFavorite,
		get_href: get_href,
		set_list: set_list
	};
});

myApp.factory('lang_code', function () {
	var lang_code = localStorage.lang_code || 'ru';
	
	function set_locale (locale) {
		if (locale == 'ru') {
			lang_code = 'ru';
			_.setTranslation(en_ru);
			moment.locale('ru');
			return lang_code;
		}

		lang_code = 'en';
		_.setTranslation(ru_en);
		moment.locale('en');
		return lang_code;
		// lang_code = 'ru';
		// _.setTranslation(en_ru);
		// moment.locale('ru');
		// return 'ru';
	}

	return {
		set_locale_to: set_locale,
		get_locale: function () {
			return lang_code;
		}
	};
});

myApp.factory('calendar_events', function ($filter, $state, jwtHelper) {
	var id = jwtHelper.decodeToken(localStorage.getItem('token'))["user_id"];

	var obj = {
		set: set,
		list: []
	}
	
	function set (events) {
		obj.list = [];
		var elem;
		for (i = 0; i < events.length; i++) {
			elem = {
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

			var invited = $filter('filter')(events[i].invitations, {id:id}, true).length;
			var accepted = $filter('filter')(events[i].invitations_accepted, {id:id}, true).length;
			var declined = $filter('filter')(events[i].invitations_declined, {id:id}, true).length;
			if (invited) {
				elem.invited = true;
			}
			if (accepted) {
				elem.accepted = true;
			}
			if (declined) {
				elem.declined = true;
			}
			obj.list.push(elem);
		}
	}

	return obj;
});

myApp.factory('vote', function ($http) {
	function like (path) {
		return $http.post(api + path + '/upvote/').then(function (resp) {
			var obj = {
				upvotes: resp["data"]["upvotes"],
				downvotes: resp["data"]["downvotes"],
			}
			return obj;
		}, function (resp) {
			console.log(resp);
		});
	}

	function dislike (path) {
		return $http.post(api + path + '/downvote/').then(function (resp) {
			var obj = {
				upvotes: resp["data"]["upvotes"],
				downvotes: resp["data"]["downvotes"],
			}
			return obj;
		}, function (resp) {
			console.log(resp);
		});
	}

	return {
		like: like,
		dislike: dislike
	}
});

myApp.factory('predicates', function () {
	function parse_replies_predicate (count) {
		var replies_predicate = ' комментариев';
		switch(count % 10) {
			case 1:
				if (count % 100 != 11) {
					replies_predicate = ' комментарий';
				};
				break;

			case 2:
				if (count % 100 != 12) {
					replies_predicate = ' комментария';
				};
				break;

			case 3:
				if (count % 100 != 13) {
					replies_predicate = ' комментария';
				};
				break;

			case 4:
				if (count % 100 != 14) {
					replies_predicate = ' комментария';
				};
				break;

			default:
				break;
		}
		return replies_predicate;
	}

	function parse_articles_predicate (count) {
		var articles_predicate = ' статей';
		switch(count % 10) {
			case 1:
				if (count % 100 != 11) {
					articles_predicate = ' статья';
				};
			break;

			case 2:
				if (count % 100 != 12) {
					articles_predicate = ' статьи';
				};
			break;

			case 3:
				if (count % 100 != 13) {
					articles_predicate = ' статьи';
				};
			break;

			case 4:
				if (count % 100 != 14) {
					articles_predicate = ' статьи';
				};
			break;

			default:
			break;
		}
		return articles_predicate;
	}

	function parse_folders_predicate (count) {
		var folders_predicate = ' папок';
		switch(count % 10) {
			case 1:
				if (count % 100 != 11) {
					folders_predicate = ' папка';
				};
			break;

			case 2:
				if (count % 100 != 12) {
					folders_predicate = ' папки';
				};
			break;

			case 3:
				if (count % 100 != 13) {
					folders_predicate = ' папки';
				};
			break;

			case 4:
				if (count % 100 != 14) {
					folders_predicate = ' папки';
				};
			break;

			default:
			break;
		}
		return folders_predicate;
	}

	return {
		parse_replies_predicate: parse_replies_predicate,
		parse_articles_predicate: parse_articles_predicate,
		parse_folders_predicate: parse_folders_predicate
	}
});

myApp.factory("SearchService", function ($state, $http, $q, $filter) {
	function get_section (category) {
		var num = parseInt(category);

		switch(num) {
			case 1:
				return {
					name: "Компании",
					href: $state.href("main.company.about")
				};

			case 2:
				return {
					name: "Сотрудники",
					href: $state.href("main.users.list")
				};

			case 3:
				return {
					name: "Новости",
					href: $state.href("main.home.news")
				};

			case 4:
				return {
					name: "Объявления",
					href: $state.href("main.home.ads")
				};

			case 5:
				return {
					name: "Поздравления",
					href: $state.href("main.home.congrats")
				};
				
			case 6:
				return {
					name: "Вакансии",
					href: $state.href("main.users.vacancies")
				};

			case 7:
				return {
					name: "Мероприятия",
					href: $state.href("main.services.events")
				};

			case 8:
				return {
					name: "Опросы",
					href: $state.href("main.services.polls")
				};

			case 9:
				return {
					name: "Аукцион",
					href: $state.href("main.services.auction")
				};

			case 10:
				return {
					name: "База знаний",
					href: $state.href("main.base")
				};

			case 11:
				return {
					name: "Фотографии",
					href: $state.href("main.media.photo")
				};

			case 12:
				return {
					name: "Видео",
					href: $state.href("main.media.video")
				};

			case 13:
				return {
					name: "Блог",
					href: $state.href("main.blog")
				};
		}
	}

	function get_model_from_category_number (category) {
		var num = parseInt(category);

		switch(num) {
			case 1:
				return "companies";

			case 2:
				return "profiles";

			case 3:
			case 4:
			case 5:
			case 6:
				return "post";

			case 7:
				return "event";

			case 8:
				return "poll";

			case 9:
				return "auction/lot";

			case 10:
				return "wikiitem";

			case 11:
				return "photo_item";

			case 12:
				return "video_item";

			case 13:
				return "blog";
		}
	}

	function get_post_type (type) {
		var num = parseInt(type);
		switch(num) {
			case 3:
				return "news";

			case 4:
				return "advert";

			case 5:
				return "congrats";

			case 6:
				return "vacancy";

			default:
				return null;
		}
	}

	function findIt (query, model) {
		return $http.get(api + model + '/?search=' + query).then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function search (query, category) {
		if (category == "3" || category == "4" || category == "5" || category == "6") {
			return findIt(query, "post").then(function (data) {
				var type = get_post_type(category);
				return $filter('filter')(data, {post_type: type}, true);
			});
		}

		if (category != "0") {
			return findIt(query, get_model_from_category_number(category));
		}

		var promises = [];
		for (i = 1; i <= 3; i++) {
			promises.push(findIt(query, get_model_from_category_number(i)));
		}
		for (i = 7; i <= 13; i++) {
			promises.push(findIt(query, get_model_from_category_number(i)));
		}

		return $q.all(promises);
	}

	return {
		search: search,
		get_section: get_section
	}
});

myApp.factory('FetchNumbers', function () {
	function transform (num) {
		return parseFloat((num / 1000).toFixed(1));
	}

	return {
		transform: function (num) {
			if (num > 999) {
				return transform(num) + 'K';
			}
			return num;
		}
	}
})