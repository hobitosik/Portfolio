var myApp = angular.module('myApp', ['oc.lazyLoad', 'infinite-scroll', 'ui.tinymce', "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.poster", 'ngRoute', 'ngSanitize', 'ui.router', 'angular-jwt', 'ngFileUpload', 'ngImgCrop']);
var api = 'api/';
// var api = 'https://192.168.132.41/api/';
var googleMapApiKey = 'AIzaSyAlkvnXi5AaP52ZI6Hb1AhyxmJdErE1TYU';

myApp.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.
	state('login', {
		url: '/login/',
		templateUrl: 'static/views/auth.html',
		data: {
			bodyClasses: 'auth onepage',
			title: 'Log In'
		},
		controller: 'AuthCtrl',
		resolve: {
			background: function ($http) {
				return $http.get(api + 'settings/', {skipAuthorization: true}).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			icons: function ($http) {
				return $http.get(api + 'logo/', {skipAuthorization: true}).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			}
		}
	}).//============================================
	state('main', {
		templateUrl: 'static/views/main_container.html',
		controller: 'MainContainerCtrl'
	}).//============================================
	state('main.search', {
		url: '/search_result/?q?cat/',
		templateUrl: 'static/views/search/search_result.html',
		data: {
			title: 'Search Result'
		},
		controller: 'SearchCtrl',
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/search/search.js");
			}
		}
	}).//============================================
	state('main.home', {
		url: '/home/',
		templateUrl: 'static/views/home/home.html',
		data: {
			title: 'Home'
		},
		controller: 'HomeCtrl',
		resolve: {
			blog: function ($http, jwtHelper, lang_code) {
				var token = localStorage.getItem("token");
				if (!token || jwtHelper.isTokenExpired(token))
					return null;
				return $http.get(api + 'blog/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http, jwtHelper, lang_code) {
				var token = localStorage.getItem("token");
				if (!token || jwtHelper.isTokenExpired(token))
					return null;
				return $http.get(api + 'blog_categories/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http, jwtHelper) {
				var token = localStorage.getItem("token");
				if (!token || jwtHelper.isTokenExpired(token))
					return null;
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/home.js");
			}
		}
	}).//============================================
	state('main.home.media', {
		url: 'media/',
		templateUrl: 'static/views/home/media.html',
		controller: 'HomeCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Медиа'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/home.js");
			}
		}
	}).
	state('main.home.media.photo', {
		url: 'photos/?company',
		templateUrl: 'static/views/home/photo_album.html',
		controller: 'HomePhotoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Фотографии'
		},
		resolve: {
			photoAlbum: function ($http) {
				return $http.get(api + 'photo_album/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/home_media.js");
			}
		}
	}).
	state('main.home.media.video', {
		url: 'video/?company',
		templateUrl: 'static/views/home/video_album.html',
		controller: 'HomeVideoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Видео'
		},
		resolve: {
			videoAlbum: function ($http) {
				return $http.get(api + 'video_album/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/home_media.js");
			}
		}
	}).//============================================
	state('main.home.activity', {
		url: 'activity/',
		template: '<my_main_content page="home/activity"></my_main_content>',
		controller: 'ActivityCtrl',
		data: {
			bodyClasses: 'home-page',
			title: 'Вся активность'
		},
		resolve: {
			posts: function ($http, lang_code) {
				return $http.get(api + 'post/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/activity.js");
			}
		}
	}).
	state('main.home.news', {
		url: 'news/',
		template: '<my_main_content page="home/activity"></my_main_content>',
		controller: 'NewsCtrl',
		data: {
			bodyClasses: 'home-page',
			title: 'Новости'
		},
		resolve: {
			news: function ($http, lang_code) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=news&language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/news.js");
			}
		}
	}).
	state('main.home.ads', {
		url: 'ads/',
		template: '<my_main_content page="home/activity"></my_main_content>',
		controller: 'AdsCtrl',
		data: {
			bodyClasses: 'home-page',
			title: 'Объявления'
		},
		resolve: {
			adverts: function ($http, lang_code) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=advert&language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/ads.js");
			}
		}
	}).
	state('main.home.congrats', {
		url: 'congrats/',
		template: '<my_main_content page="home/activity"></my_main_content>',
		controller: 'CongratsCtrl',
		data: {
			bodyClasses: 'home-page',
			title: 'Поздравления'
		},
		resolve: {
			congrats: function ($http, lang_code) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=congrats&language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/congrats.js");
			}
		}
	}).
	state('main.home.blog', {
		url: 'blog/',
		templateUrl: 'static/views/blog/activity.html',
		controller: 'BlogLatestCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/latest.js");
			}
		}
	}).
	state('main.home.post', {
		url: 'post/:id/',
		template: '<my_main_content page="home/post"></my_main_content>',
		controller: 'PostsCtrl',
		data: {
			title: 'Title'
		},
		resolve: {
			post: function ($http, $stateParams) {
				return $http.get(api + 'post/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/posts.js");
			}
		}
	}).//============================================
	state('main.users', {
		url: '/users/',
		templateUrl: 'static/views/users/users.html',
		controller: 'UsersCtrl',
		data: {
			title: 'Users'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/users.js");
			}
		}
	}).
	state('main.users.list', {
		url: 'list/',
		template: '<my_main_content page="users/users_list"></my_main_content>',
		controller: 'UsersListCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Список сотрудников'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/users_list.js");
			}
		}
	}).
	state('main.users.best', {
		url: 'best/',
		template: '<my_main_content page="users/best_users"></my_main_content>',
		controller: 'BestUsersCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Лучшие сотрудники'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/best_users.js");
			}
		}
	}).
	state('main.users.bestDet', {
		url: 'best/:id/',
		template: '<my_main_content page="users/best_users_detail"></my_main_content>',
		controller: 'BestUsersDetCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Лучшие сотрудники'
		},
		resolve: {
			bestUser: function ($http, $stateParams) {
				return $http.get(api + 'bestemployee/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/best_users_detail.js");
			}
		}
	}).
	state('main.users.congrats', {
		url: 'congrats/',
		template: '<my_main_content page="users/activity"></my_main_content>',
		controller: 'CongratsCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Поздравления'
		},
		resolve: {
			congrats: function ($http, lang_code) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=congrats&language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/congrats.js");
			}
		}
	}).
	state('main.users.vacancies', {
		url: 'vacancies/',
		template: '<my_main_content page="users/vacancy"></my_main_content>',
		controller: 'VacanciesCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Вакансии'
		},
		resolve: {
			vacancies: function ($http) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=vacancy').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/vacancy.js");
			}
		}
	}).
	state('main.users.vacancy_detailed', {
		url: 'detailed/:id/',
		template: '<my_main_content page="users/vacancy_detail"></my_main_content>',
		controller: 'VacancyDetailCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Вакансии'
		},
		resolve: {
			vacancy: function ($http, $stateParams) {
				return $http.get(api + 'post/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/vacancy_detail.js");
			}
		}
	}).
	state('main.users.profile', {
		url: 'profile/:id/',
		template: '<my_main_content page="users/profile"></my_main_content>',
		controller: 'ProfileCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Профиль'
		},
		resolve: {
			user: function ($http, $stateParams, jwtHelper) {
				var id = jwtHelper.decodeToken(localStorage.getItem('token'))['user_id'];
				if ($stateParams.id) {
					id = $stateParams.id;
				}

				return $http.get(api + 'users/' + id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile.js");
			}
		}
	}).
	state('main.users.profile.favorites', {
		url: 'favorites/',
		template: '<my_main_content page="users/profile_all_favs"></my_main_content>',
		controller: 'ProfileFavoritesCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Избранное'
		},
		resolve: {
			fav_set: function ($http, favorites) {
				return favorites.set_list();
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_favorites.js");
			}
		}
	}).
	state('main.users.profile.nominations', {
		url: 'nominations/',
		template: '<my_main_content page="users/profile_nominations"></my_main_content>',
		controller: 'ProfileNominationsCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Номинации'
		},
		resolve: {
			nominations: function ($http) {
				return $http.get(api + 'bestemployee/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_nominations.js");
			}
		}
	}).
	state('main.users.profile.about', {
		url: 'about/',
		template: '<my_main_content page="users/profile_about"></my_main_content>',
		controller: 'ProfileAboutCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Профиль'
		},
		resolve: {
			positions: function ($http) {
				return $http.get(api + 'positions/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			departments: function ($http) {
				return $http.get(api + 'departments/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			statuses: function ($http) {
				return $http.get(api + 'user_status/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_about.js");
			}
		}
	}).
	state('main.users.profile.articles', {
		url: 'articles/',
		templateUrl: 'static/views/users/profile_articles.html',
		controller: 'ProfileArticlesCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Публикации'
		},
		resolve: {
			articles: function ($http, user) {
				return $http.get(api + 'blog/?user=' + user.id).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http) {
				if (!localStorage.blog_categories) {
					return $http.get(api + 'blog_categories/').then(function (resp) {
						return resp["data"];
					}, function (resp) {
						console.log(resp);
						return null;
					});
				}
				return JSON.parse(localStorage.blog_categories);
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_articles.js");
			}
		}
	}).
	state('main.users.profile.calendar', {
		url: 'calendar/',
		template: "<div id='profileCalendar'></div>",
		controller: 'ProfileCalendarCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Календарь'
		},
		resolve: {
			events: function ($http, user) {
				return $http.get(api + 'event/?user=' + user.id).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_calendar.js");
			}
		}
	}).
	state('main.users.profile.lots', {
		url: 'lots/',
		template: '<my_main_content page="users/profile_lots"></my_main_content>',
		controller: 'ProfileLotsCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Лоты'
		},
		resolve: {
			lots: function ($http, user) {
				return $http.get(api + 'auction/lot/?user=' + user.id).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http) {
				return $http.get(api + 'auction/category/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_lots.js");
			}
		}
	}).
	state('main.users.profile.editLot', {
		url: 'edit_lot/:lot_id/',
		template: '<my_main_content page="users/profile_edit_lot"></my_main_content>',
		controller: 'ProfileEditLotCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Редактировать лот'
		},
		resolve: {
			lot: function ($http, $stateParams) {
				return $http.get(api + 'auction/lot/' + $stateParams.lot_id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			countries: function ($http) {
				return $http.get(api + 'cities/countries/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http) {
				return $http.get(api + 'auction/category/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/profile_edit_lot.js");
			}
		}
	}).
	state('main.users.editProfile', {
		url: 'edit_profile/',
		template: '<my_profile_edit></my_profile_edit>',
		controller: 'EditProfileCtrl',
		data: {
			bodyClasses: 'users-page',
			title: 'Редактирование профиля'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/users/edit_profile.js");
			}
		}
	}).
	state('main.users.post', {
		url: 'post/:id/',
		template: '<my_main_content page="home/post"></my_main_content>',
		controller: 'PostsCtrl',
		data: {
			title: 'Title'
		},
		resolve: {
			post: function ($http, $stateParams) {
				return $http.get(api + 'post/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/posts.js");
			}
		}
	}).//============================================
	state('main.company', {
		url: '/company/',
		templateUrl: 'static/views/company/company.html',
		controller: 'CompanyCtrl',
		data: {
			title: 'Company'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/company/company.js");
			}
		}
	}).
	state('main.company.mission', {
		url: 'mission/',
		templateUrl: 'static/views/company/mission.html',
		controller: 'CompanyMissionCtrl',
		data: {
			title: 'Миссия и ценности'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/company/company_mission.js");
			}
		}
	}).
	state('main.company.about', {
		url: 'about/',
		template: '<my_main_content page="company/about_company"></my_main_content>',
		controller: 'AboutCompanyCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'О компании'
		},
		resolve: {
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/company/about_company.js");
			}
		}
	}).
	state('main.company.about.instance', {
		url: 'instance/:id/',
		template: '<my_main_content page="company/about"></my_main_content>',
		controller: 'AboutCompanyCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'О компании'
		}
	}).
	state('main.company.structure', {
		url: 'company_structure/',
		template: '<my_company_structure></my_company_structure>',
		controller: 'CompanyStructureCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'Структура компании'
		},
		resolve: {
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/company/company_structure.js");
			}
		}
	}).
	state('main.company.detail', {
		url: 'company_detail/:id/',
		template: '<my_company_detail></my_company_detail>',
		controller: 'CompanyDetailCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'Company Detail'
		},
		resolve: {
			company_instanse: function ($http, $stateParams) {
				if ($stateParams.id == "") {
					return null;
				};
				return $http.get(api + 'companies/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/company/company_detail.js");
			}
		}
	}).
	state('main.company.news', {
		url: 'news/',
		template: '<section id="main" class="left"><div id="content" class="right"><my_main_content page="company/activity"></my_main_content></div></section>',
		controller: 'NewsCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'Новости'
		},
		resolve: {
			news: function ($http) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=news').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/news.js");
			}
		}
	}).
	state('main.company.ads', {
		url: 'ads/',
		template: '<section id="main" class="left"><div id="content" class="right"><my_main_content page="company/activity"></my_main_content></div></section>',
		controller: 'AdsCtrl',
		data: {
			bodyClasses: 'company-page',
			title: 'Объявления'
		},
		resolve: {
			adverts: function ($http) {
				return $http.get(api + 'post/?limit=6&offset=0&post_type=advert').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/ads.js");
			}
		}
	}).
	state('main.company.post', {
		url: 'post/:id/',
		template: '<section id="main" class="left"><div id="content" class="right"><my_main_content page="home/post"></my_main_content></div></section>',
		controller: 'PostsCtrl',
		data: {
			title: 'Title'
		},
		resolve: {
			post: function ($http, $stateParams) {
				return $http.get(api + 'post/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/home/posts.js");
			}
		}
	}).//============================================
	state('main.services', {
		url: '/services/',
		templateUrl: 'static/views/services/services.html',
		controller: 'ServicesCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Services'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/services.js");
			}
		}
	}).//============================================
	state('main.services.events', {
		url: 'event/',
		template: '<my_main_content page="services/events/events"></my_main_content>',
		controller: 'EventsCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Мероприятия'
		},
		resolve: {
			events: function ($http) {
				return $http.get(api + 'event/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/events/events.js");
			}
		}
	}).
	state('main.services.events.list', {
		url: 'list/',
		templateUrl: 'static/views/services/events/events_list.html',
		controller: 'EventsListCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Мероприятия'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/events/events_list.js");
			}
		}
	}).
	state('main.services.events.calendar', {
		url: 'calendar/',
		templateUrl: 'static/views/services/events/events_calendar.html',
		controller: 'EventsCalendarCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Мероприятия'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/events/events_calendar.js");
			}
		}
	}).
	state('main.services.events.detail', {
		url: 'detail/:id/',
		templateUrl: 'static/views/services/events/events_detail.html',
		controller: 'EventsDetailCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Мероприятия'
		},
		resolve: {
			event: function ($http, $stateParams) {
				return $http.get(api + 'event/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/events/events_detail.js");
			}
		}
	}).//============================================
	state('main.services.auction', {
		url: 'auction/',
		template: '<my_main_content page="services/auction/auction"></my_main_content>',
		controller: 'AuctionCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Аукцион'
		},
		resolve: {
			countries: function ($http) {
				return $http.get(api + 'cities/countries/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http) {
				return $http.get(api + 'auction/category/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/auction/auction.js");
			}
		}
	}).
	state('main.services.auction.lots', {
		url: 'lots/',
		template: '<my_main_content page="services/auction/lots"></my_main_content>',
		controller: 'AuctionLotsCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Лоты'
		},
		resolve: {
			lots: function ($http) {
				return $http.get(api + 'auction/lot/?limit=6&offset=0').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/auction/lots.js");
			}
		}
	}).
	state('main.services.auction.lotDetails', {
		url: 'details/:id/',
		template: '<my_main_content page="services/auction/lot_details"></my_main_content>',
		controller: 'AuctionLotsDetailCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Детально'
		},
		resolve: {
			lot: function ($http, $stateParams) {
				if (!$stateParams.id)
					return null;

				return $http.get(api + 'auction/lot/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/auction/lots_detail.js");
			}
		}
	}).
	state('main.services.auction.addLot', {
		url: 'add_lot/',
		template: '<my_main_content page="services/auction/add_lot"></my_main_content>',
		controller: 'AuctionAddLotCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Добавить лот'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/auction/add_lot.js");
			}
		}
	}).//============================================
	state('main.services.polls', {
		url: 'polls/',
		template: '<my_main_content page="services/polls/polls"></my_main_content>',
		controller: 'PollsCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			polls: function ($http, lang_code) {
				return $http.get(api + 'poll/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls.js");
			}
		}
	}).
	state('main.services.polls.list', {
		url: 'list/',
		template: '<my_main_content page="services/polls/polls_list"></my_main_content>',
		controller: 'PollsListCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls_list.js");
			}
		}
	}).
	state('main.services.polls.detail', {
		url: 'detail/:id/',
		template: '<my_main_content page="services/polls/polls_detail"></my_main_content>',
		controller: 'PollsDetailCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			poll: function ($http, $stateParams) {
				if (!$stateParams.id) {
					return null;
				}
				return $http.get(api + 'poll/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls_detail.js");
			}
		}
	}).
	state('main.services.polls.detail.description', {
		url: 'description/',
		template: '<my_main_content page="services/polls/polls_detail_description"></my_main_content>',
		controller: 'PollsDetailDescriptionCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls_detail_description.js");
			}
		}
	}).
	state('main.services.polls.detail.questions', {
		url: 'questions/',
		template: '<my_main_content page="services/polls/polls_detail_questions"></my_main_content>',
		controller: 'PollsDetailQuestionsCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls_detail_questions.js");
			}
		}
	}).
	state('main.services.polls.detail.result', {
		url: 'result/',
		template: '<my_main_content page="services/polls/polls_detail_result"></my_main_content>',
		controller: 'PollsDetailResultCtrl',
		data: {
			bodyClasses: 'services-page',
			title: 'Опросы'
		},
		resolve: {
			results: function ($http, $stateParams) {
				if (!$stateParams.id) {
					return null;
				}
				return $http.get(api + 'poll/' + $stateParams.id + '/results/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/services/polls/polls_detail_result.js");
			}
		}
	}).//============================================
	state('main.base', {
		url: '/base/',
		templateUrl: 'static/views/base/base.html',
		controller: 'BaseCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'База знаний'
		},
		resolve: {
			wiki: function ($http) {
				return $http.get(api + 'wiki/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base.js");
			}
		}
	}).
	state('main.base.nav', {
		templateUrl: 'static/views/base/base_with_navbar.html',
		controller: 'BaseCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'База знаний'
		}
	}).
	state('main.base.nav.structure', {
		url: 'structure/',
		template: '<my_main_content page="base/structure"></my_main_content>',
		controller: 'BaseStructureCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'База знаний: структура'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base_structure.js");
			}
		}
	}).
	state('main.base.nav.fresh', {
		url: 'new/',
		template: '<my_main_content page="base/fresh"></my_main_content>',
		controller: 'BaseFreshCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'База знаний: новинки'
		},
		resolve: {
			articles: function ($http) {
				return $http.get(api + 'wikiitem/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base_fresh_and_popular.js");
			}
		}
	}).
	state('main.base.nav.popular', {
		url: 'popular/',
		template: '<my_main_content page="base/popular"></my_main_content>',
		controller: 'BasePopularCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'База знаний: популярное'
		},
		resolve: {
			articles: function ($http) {
				return $http.get(api + 'wikiitem/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base_fresh_and_popular.js");
			}
		}
	}).
	state('main.base.folder', {
		url: 'folder/:level/?index_arr/',
		template: '<my_main_content page="base/folder"></my_main_content>',
		controller: 'BaseFolderCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'Папка'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base_folder.js");
			}
		}
	}).
	state('main.base.detailed', {
		url: 'detailed/:id?folder/',
		template: '<my_main_content page="base/detailed"></my_main_content>',
		controller: 'BaseDetailedCtrl',
		data: {
			bodyClasses: 'base-page',
			title: 'Подробно'
		},
		resolve: {
			article: function ($http, $stateParams) {
				if ($stateParams.id == "") {
					return null;
				};

				return $http.get(api + 'wikiitem/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/base/base_detailed.js");
			}
		}
	}).//============================================
	state('main.blog', {
		url: '/blog/',
		templateUrl: 'static/views/blog/blog.html',
		controller: 'BlogCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			blog: function ($http, lang_code) {
				return $http.get(api + 'blog/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			categories: function ($http, lang_code) {
				return $http.get(api + 'blog_categories/?language=' + lang_code.get_locale()).then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			companies: function ($http) {
				return $http.get(api + 'companies/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/blog.js");
			}
		}
	}).
	state('main.blog.addPost', {
		url: 'add_post/',
		templateUrl: 'static/views/blog/add_post.html',
		controller: 'BlogAddPostCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Добавить статью'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/add_post.js");
			},
			loadTinymce: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/min/tinymce/tinymce.min.js");
			}
		}
	}).
	state('main.blog.detailed', {
		url: 'detailed/:id/',
		templateUrl: 'static/views/blog/detailed.html',
		controller: 'BlogDetailedCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			article: function ($http, $stateParams) {
				return $http.get(api + 'blog/' + $stateParams.id + '/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/detailed.js");
			}
		}
	}).
	state('main.blog.latest', {
		url: 'latest/?cat_name/',
		templateUrl: 'static/views/blog/activity.html',
		controller: 'BlogLatestCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/latest.js");
			}
		}
	}).
	state('main.blog.best', {
		url: 'best/',
		templateUrl: 'static/views/blog/activity.html',
		controller: 'BlogBestCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/best.js");
			}
		}
	}).
	state('main.blog.popular', {
		url: 'popular/',
		templateUrl: 'static/views/blog/activity.html',
		controller: 'BlogPopularCtrl',
		data: {
			bodyClasses: 'blog-page',
			title: 'Блог'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/blog/popular.js");
			}
		}
	}).//============================================
	state('main.media', {
		url: '/media/',
		templateUrl: 'static/views/media/media.html',
		controller: 'MediaCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Медиа'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/media/media.js");
			}
		}
	}).
	state('main.media.photo', {
		url: 'photos/',
		template: '<ui-view></ui-view>',
		controller: 'PhotoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Фотографии'
		},
		resolve: {
			photoAlbum: function ($http) {
				return $http.get(api + 'photo_album/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/media/photo.js");
			}
		}
	}).
	state('main.media.video', {
		url: 'video/',
		template: '<ui-view></ui-view>',
		controller: 'VideoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Видео'
		},
		resolve: {
			videoAlbum: function ($http) {
				return $http.get(api + 'video_album/').then(function (resp) {
					return resp["data"];
				}, function (resp) {
					console.log(resp);
					return null;
				});
			},
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/media/video.js");
			}
		}
	}).
	state('main.media.photo.album', {
		url: 'album/',
		templateUrl: 'static/views/media/photo_album.html',
		controller: 'PhotoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Фотографии'
		}
	}).
	state('main.media.video.album', {
		url: 'album/',
		templateUrl: 'static/views/media/video_album.html',
		controller: 'VideoCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Видео'
		}
	}).
	state('main.media.photo.detail', {
		url: 'detailed/?id?album_id',
		templateUrl: 'static/views/media/photo_detailed.html',
		controller: 'PhotoDetailCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Фотографии'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/media/photo_detail.js");
			}
		}
	}).
	state('main.media.video.detail', {
		url: 'detailed/?id?album_id',
		templateUrl: 'static/views/media/video_detailed.html',
		controller: 'VideoDetailCtrl',
		data: {
			bodyClasses: 'media-page',
			title: 'Видео'
		},
		resolve: {
			loadMyCtrl: function ($ocLazyLoad) {
				return $ocLazyLoad.load("static/js/controllers/media/video_detail.js");
			}
		}
	});
}]);

myApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});

myApp.filter('limitHtml', function() {
        return function(text, limit) {
        	var changedString = String(text).replace(/<\/p>/g, '\n');
        	changedString = String(text).replace(/<br ?\/>/g, '\n');
            changedString = String(changedString).replace(/<[^>]+>/gm, '');
            var length = changedString.length;

            return changedString.length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
        }
    });

var last_refreshed = Date.now();
myApp.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', '$rootScope', function(jwtHelper, $http, $rootScope) {
    var token = localStorage.getItem('token');

    var timeDiff = Date.now() - last_refreshed;

    if (timeDiff > 5000) {
    	last_refreshed = Date.now();
    	return $http({
		    url: api+'auth/token/refresh/',
		    // This makes it so that this request doesn't send the JWT
		    skipAuthorization: true,
		    method: 'POST',
		    data: {
		    	"token": token
		    }
	    }).then(function (response) {
		    var newToken = response['data']['token'];
		    localStorage.setItem('token', newToken);
		    // console.log("refreshing token");
		    return newToken;
	    }, function (response) {
	    	return token;
	    });
    } else {
    	return token;
    };
  }];
  $httpProvider.interceptors.push('jwtInterceptor');
});

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

myApp.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.
    'https://www.google.com/maps/**'
  ]);
});

var dataURItoBlob = function(dataURI, filename) {
	var binary = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var array = [];
	for(var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([new Uint8Array(array)], {type: mimeString});
};

function strip_html(html) {
   // var tmp = document.createElement("DIV");
   // tmp.innerHTML = html;
   // return tmp.textContent || tmp.innerText || "";
   return (new DOMParser).parseFromString(html, "text/html") .
        documentElement . textContent;
}

function addStylesheetRule (rule) {
  var styleEl = document.createElement('style'),
      styleSheet;

  // Append style element to head
  document.head.appendChild(styleEl);

  // Grab style sheet
  styleSheet = styleEl.sheet;

  // Insert CSS Rule
  styleSheet.insertRule(rule, 0);
}
// set_locale_to((window.navigator.userLanguage || window.navigator.language).split('-')[0]);
