// "Все разделы", // 0 //

// "Компании", // 1 //
// "Сотрудники", // 2 //

// "Новости", // 3 //
// "Объявления", // 4 //
// "Поздравления", // 5 //
// "Вакансии", // 6 //

// "Мероприятия", // 7 //
// "Опросы", // 8 //
// "Аукцион", // 9 //
// "База знаний", // 10 //
// "Фотографии", // 11 //
// "Видео", // 12 //
// "Блог" // 13 //

angular.module('myApp').controller('SearchCtrl',
function ($scope, $state, $stateParams, $filter, jwtHelper, SearchService) {
	var token = localStorage.getItem('token');

	if (!$stateParams.q) {
		$state.go("main.home");
	}
	var results;

	var query = $stateParams.q;
	var category = $stateParams.cat;
	
	$scope.results = [];
	$scope.not_found = false;

	if (category == '0') {
		SearchService.search(query, category).then(parse_all_categories);
	} else {
		SearchService.search(query, category).then(parse_current_category);
	}

	$scope.infiniteScroll = {
		disabled: true,
		append_data: function append_data () {
			this.disabled = true;
			if (!results.length) {
				return;
			}
			for (i = 0; i < 6; i++) {
				$scope.results.push(results.pop());
				if (!results.length) {
					return;
				}
			}
			this.disabled = false;
		}
	}

	function parse_all_categories (data) {
		// companies
		results = parse_companies(data[0]);
		
		// users
		results = results.concat(parse_users(data[1]));
		
		// posts
		results = results.concat(parse_posts(data[2]));
		
		// events
		results = results.concat(parse_events(data[3]));
		
		// polls
		results = results.concat(parse_polls(data[4]));
		
		// auction
		results = results.concat(parse_auction(data[5]));
		
		// wiki
		results = results.concat(parse_wikiitem(data[6]));
		
		// photos
		results = results.concat(parse_photos(data[7]));
		
		// videos
		results = results.concat(parse_videos(data[8]));
		
		// blog
		results = results.concat(parse_blog(data[9]));

		results = $filter('orderBy')(results, '+added');

		if (!results.length) {
			$scope.not_found = true;
			return;
		}

		$scope.infiniteScroll.disabled = false;
	}

	function parse_current_category (data) {
		var num = parseInt(category);

		switch(num) {
			case 1:
				results = parse_companies(data);
				break;

			case 2:
				results = parse_users(data);
				break;

			case 3:
			case 4:
			case 5:
			case 6:
				results = parse_posts(data);
				break;

			case 7:
				results = parse_events(data);
				break;

			case 8:
				results = parse_polls(data);
				break;

			case 9:
				results = parse_auction(data);
				break;

			case 10:
				results = parse_wikiitem(data);
				break;

			case 11:
				results = parse_photos(data);
				break;

			case 12:
				results = parse_videos(data);
				break;

			case 13:
				results = parse_blog(data);
				break;
		}

		results = $filter('orderBy')(results, '+added');

		if (!results.length) {
			$scope.not_found = true;
			return;
		}

		$scope.infiniteScroll.disabled = false;
	}

	function parse_companies (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.company.about.instance", {id: value.id}),
				image: value.logo,
				title: value.name,
				text: value.description,
				section: SearchService.get_section(1),
				added: Date.now()
			}

			result.push(obj);
		});

		return result;
	}

	function parse_users (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.users.profile", {id: value.user.id}),
				image: value.photo,
				title: value.first_name + ' ' + value.last_name,
				text: value.about,
				section: SearchService.get_section(2),
				added: Date.now()
			}

			result.push(obj);
		});

		return result;
	}

	function parse_posts (data) {
		var result = [];


		data.forEach(function (value, index) {
			var section;
			var href;
			switch(value.post_type) {
				case "news":
					section = 3;
					break;

				case "advert":
					section = 4;
					break;

				case "congrats":
					section = 5;
					break;

				case "vacancy":
					section = 6;
					href = $state.href("main.users.vacancy_detailed", {id: value.id});
					break;
			}

			var obj = {
				href: href || $state.href("main.home.post", {id: value.id}),
				image: value.image,
				title: value.title,
				text: value.text,
				section: SearchService.get_section(section),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_events (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.services.events.detail", {id: value.id}),
				image: value.image,
				title: value.title,
				text: value.text,
				section: SearchService.get_section(7),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_polls (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.services.polls.detail", {id: value.id}),
				image: value.image,
				title: value.name,
				text: value.description,
				section: SearchService.get_section(8),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_auction (data) {
		var result = [];
		data.forEach(function (value, index) {
			var image;
			if (value.main_photo) {
				image = $filter('filter')(value.lot_photos, {id: value.main_photo}, true)[0].image;
			}
			
			var obj = {
				href: $state.href("main.services.auction.lotDetails", {id: value.id}),
				image: image || value.lot_photos[0].image,
				title: value.name,
				text: value.text,
				section: SearchService.get_section(9),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_wikiitem (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.base.detailed", {id: value.id}),
				image: null,
				title: value.name,
				text: value.wiki_articles[0].text,
				section: SearchService.get_section(10),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_photos (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.media.photo.detail", {id: value.id, album_id: value.album}),
				image: value.attachment,
				title: value.name,
				text: value.description,
				section: SearchService.get_section(11),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_videos (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.media.video.detail", {id: value.id, album_id: value.album}),
				image: value.attachment + '.jpg',
				title: value.name,
				text: value.description,
				section: SearchService.get_section(12),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}

	function parse_blog (data) {
		var result = [];
		data.forEach(function (value, index) {
			var obj = {
				href: $state.href("main.blog.detailed", {id: value.id}),
				image: value.image,
				title: value.title,
				text: value.text,
				section: SearchService.get_section(13),
				added: value.added
			}

			result.push(obj);
		});

		return result;
	}
});