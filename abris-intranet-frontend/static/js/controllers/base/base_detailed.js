angular.module('myApp').controller('BaseDetailedCtrl',
function ($scope, $state, $http, $filter, $timeout, $sce, $q, favorites, jwtHelper, vote, article, predicates) {
	if (!article) {
		$state.go("main.base");
	};
	var token = localStorage.getItem('token');

	$scope.to_trusted = function (html_code) {
		return $sce.trustAsHtml(html_code);
	}

	$scope.breadcrumb_active = article.name.slice(0, 15);
	if (article.name.length > $scope.breadcrumb_active.length) {
		$scope.breadcrumb_active += '...';
	};
	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.base': 'База знаний'
	};
// start -- туда-сюда
	$scope.prevArticle = {
		show: false
	}
	$scope.nextArticle = {
		show: false
	}
	function parseArticleSwitcher () {
		var thisFolder = $state.params.folder;
		if (thisFolder == undefined || thisFolder == '') {
			thisFolder = 'folderArticles';
		};

		var thisArticleIndex = undefined;
		var articlesArr = undefined;
		var maxIndex = undefined;
		var myFolderString = localStorage.getItem(thisFolder);
		if (myFolderString) {
			articlesArr = JSON.parse(myFolderString);
			maxIndex = articlesArr.length - 1;

			for(i = 0; i <= maxIndex; i++) {
				if (articlesArr[i].id == article.id) {
					thisArticleIndex = i;
					break;
				};
			}
		};

		if (thisArticleIndex == undefined) {
			var wiki_items = JSON.parse(localStorage.getItem('wiki'));
			var mainCat = $filter('filter')(wiki_items, {"wiki_article_items": {"id": parseInt(article.id)}}, true);
			if (mainCat == undefined || mainCat.length != 1) {
				return;
			};
			articlesArr = $filter('orderBy')(mainCat[0]["wiki_article_items"], 'name');
			maxIndex = articlesArr.length - 1;

			for(i = 0; i <= maxIndex; i++) {
				if (articlesArr[i].id == article.id) {
					thisArticleIndex = i;
					break;
				};
			}

			if (thisArticleIndex == undefined) {
				return;
			};
		};

		switch(thisArticleIndex) {
			case 0:
				if (articlesArr.length > 1) {
					$scope.nextArticle = {
						show: true,
						name: articlesArr[thisArticleIndex + 1].name.slice(0, 15),
						id: articlesArr[thisArticleIndex + 1].id,
						folder: thisFolder
					}
					if (articlesArr[thisArticleIndex + 1].name.length > $scope.nextArticle.name.length) {
						$scope.nextArticle.name += '...';
					};
				};
				break;

			case maxIndex:
				if (articlesArr.length > 1) {
					$scope.prevArticle = {
						show: true,
						name: articlesArr[thisArticleIndex - 1].name.slice(0, 15),
						id: articlesArr[thisArticleIndex - 1].id,
						folder: thisFolder
					}
					if (articlesArr[thisArticleIndex - 1].name.length > $scope.prevArticle.name.length) {
						$scope.prevArticle.name += '...';
					};
				};
				break;

			default:
				$scope.prevArticle = {
					show: true,
					name: articlesArr[thisArticleIndex - 1].name.slice(0, 15),
					id: articlesArr[thisArticleIndex - 1].id,
					folder: thisFolder
				}
				if (articlesArr[thisArticleIndex - 1].name.length > $scope.prevArticle.name.length) {
					$scope.prevArticle.name += '...';
				};
				$scope.nextArticle = {
					show: true,
					name: articlesArr[thisArticleIndex + 1].name.slice(0, 15),
					id: articlesArr[thisArticleIndex + 1].id,
					folder: thisFolder
				}
				if (articlesArr[thisArticleIndex + 1].name.length > $scope.nextArticle.name.length) {
					$scope.nextArticle.name += '...';
				};
				break;
		}
	}
	parseArticleSwitcher();
// end -- туда-сюда
	$scope.show_files = false;
	$scope.edited = false;
	if (article.wiki_articles.length > 1) {
		$scope.edited = true;
	};

	$scope.title = article.name;
	$scope.version_control = {
		version: -1
	};

	if ($scope.edited) {
		$scope.versions = [];
		article.wiki_articles.forEach(function (value, index, array) {
			var obj = {
				index: index,
				version: value.version
			}

			$scope.versions.push(obj);
		});
		$scope.version_control.version = article.wiki_articles.length - 1;
	} else {
		get_version(0);
	}

	$scope.$watch('version_control.version', function (newValue, oldValue, scope) {
		get_version(newValue);
	});

	$scope.scroll_to_anchor = function (hash) {
		var target = $('#' + hash);
		$('html, body').stop().animate({
	        'scrollTop': target.offset().top - 90
	    }, 900, 'swing');
	}

	function get_version (index) {
		if (index == undefined || index < 0) {
			return;
		};
		if ($scope.version_control.version != index) {
			$scope.version_control.version = index;
		};
		var text = $(article.wiki_articles[index].text);
		$scope.navigation = [];

		text.filter('h1').each(function () {
			var id = 'anchor' + $scope.navigation.length;

			$(this).attr('id', id);

			var obj = {
				id: id,
				title: $(this).text()
			}

			$scope.navigation.push(obj);
		});

		$scope.text = text.map(function () { return this.outerHTML; }).get().join('');
	}

	$scope.list_files = function () {
		$scope.attachments = [];
		var thisVersionAttachments = $filter('filter')(article.wiki_article_attachments, {"version": article.wiki_articles[$scope.version_control.version].version}, true);
		var noVersionAttachments = [];
		if (article.wiki_articles[$scope.version_control.version].version != "") {
			noVersionAttachments = $filter('filter')(article.wiki_article_attachments, {"version": ""}, true);
		}

		thisVersionAttachments.concat(noVersionAttachments).forEach(function (value, index, array) {
			var size = value.size / 1024 / 1024;
			var type = get_mime_type(value.mime);

			var obj = {
				name: value.name,
				type: type,
				info: size.toFixed(2) + ' mb',
				url: value.attachment,
				id: value.id
			}

			$scope.attachments.push(obj);
		});

		$scope.show_files = true;
	}
	$scope.show_content = function () {
		$scope.show_files = false;
	}

	$scope.thisArticle = article;
	$scope.thisArticle.isFavorite = favorites.isFavorite(article, 'wikiitem');
	$scope.replies_predicate = predicates.parse_replies_predicate($scope.thisArticle.replies);

	var users = undefined;
	var replies = undefined;

	function getReplies () {
		return $http.get(api + 'wikiitem/' + $state.params.id + '/get_replies/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	function getUsers () {
		return $http.get(api + 'users/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}

	$scope.show_comments = false;
	$scope.get_comments = function () {
		if ($scope.show_comments) {
			return;
		};
		$scope.comments = [];
		$q.all([getReplies(), getUsers()]).then(function (resp) {
			replies = resp[0];
			users = resp[1];
			generate_comments(resp[0], resp[1]);
		});
	}

	function generate_comments (comments, users) {
		comments.forEach(function (value, index, array) {
			var author = $filter('filter')(users, {"id": parseInt(value.user.id)}, true)[0];
			if (author.profile) {
				var my_user = author.profile;
			} else {
				var my_user = {
					first_name: author.username,
					last_name: "",
					middle_name: "",
					photo: null
				};
			}
			var obj = {
				content: value.content,
				username: my_user.first_name + ' ' + my_user.last_name + ' ' + my_user.middle_name,
				avatar: my_user.photo,
				user_id: value.user.id,
				created: moment(value.created).format("DD.MM.YYYY в HH:mm"),
				created_date: value.created,
				id: value.id,
				upvotes: value.upvotes,
				downvotes: value.downvotes,
				children: [],
				answer: false,
				answer_text: ''
			}

			var my_children = value.children;
			my_children.forEach(function (value1, index1, array1) {
				var author1 = $filter('filter')(users, {"id": parseInt(value1.user.id)}, true)[0];
				if (author1.profile) {
					var my_user1 = author1.profile;
				} else {
					var my_user1 = {
						first_name: author1.username,
						last_name: "",
						middle_name: "",
						photo: null
					};
				}
				var child = {
					content: value1.content,
					username: my_user1.first_name + ' ' + my_user1.last_name + ' ' + my_user1.middle_name,
					avatar: my_user1.photo,
					user_id: value1.user.id,
					created: moment(value1.created).format("DD.MM.YYYY в HH:mm"),
					created_date: value1.created,
					id: value1.id,
					upvotes: value1.upvotes,
					downvotes: value1.downvotes
				}

				obj.children.push(child);
			});
			obj.children = $filter('orderBy')(obj.children, '+created_date');

			$scope.comments.push(obj);
		});

		$scope.comments = $filter('orderBy')($scope.comments, '+created_date');
		$scope.show_comments = true;
		$scope.commentText = {
			text: ''
		};
	}

	$scope.answer_comment = function (index) {
		$scope.comments[index].answer = !$scope.comments[index].answer;
	}

	$scope.send_answer_to = function (index) {
		if ($scope.comments[index].answer_text == '') {
			return;
		};
		var sendIt = {
			"content": $scope.comments[index].answer_text,
			"parent": $scope.comments[index].id
		}

		$http.post(api + 'wikiitem/' + $state.params.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": parseInt(resp["data"].user.id)}, true)[0];
			if (this_author.profile) {
				var this_user = this_author.profile;
			} else {
				var this_user = {
					first_name: this_author.username,
					last_name: "",
					middle_name: "",
					photo: null
				};
			}
			var obj = {
				content: resp["data"].content,
				username: this_user.first_name + ' ' + this_user.last_name + ' ' + this_user.middle_name,
				avatar: this_user.photo,
				user_id: resp["data"].user.id,
				created: moment(resp["data"].created).format("DD.MM.YYYY в HH:mm"),
				created_date: resp["data"].created,
				id: resp["data"].id,
				upvotes: resp["data"].upvotes,
				downvotes: resp["data"].downvotes
			}

			$scope.comments[index].children.push(obj);
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.thisArticle.replies);

			$scope.comments[index].answer_text = '';
			$scope.comments[index].answer = false;
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.make_comment = function () {
		if ($scope.commentText.text == '') {
			return;
		};

		var sendIt = {
			"content": $scope.commentText.text
		}

		$http.post(api + 'wikiitem/' + $state.params.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": parseInt(resp["data"].user.id)}, true)[0];
			if (this_author.profile) {
				var this_user = this_author.profile;
			} else {
				var this_user = {
					first_name: this_author.username,
					last_name: "",
					middle_name: "",
					photo: null
				};
			}
			var obj = {
				content: resp["data"].content,
				username: this_user.first_name + ' ' + this_user.last_name + ' ' + this_user.middle_name,
				avatar: this_user.photo,
				user_id: resp["data"].user.id,
				created: moment(resp["data"].created).format("DD.MM.YYYY в HH:mm"),
				created_date: resp["data"].created,
				id: resp["data"].id,
				upvotes: resp["data"].upvotes,
				downvotes: resp["data"].downvotes,
				children: [],
				answer: false,
				answer_text: ''
			}

			$scope.comments.push(obj);
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.thisArticle.replies);

			$scope.commentText.text = '';
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.like = function (obj, path) {
		vote.like(path + '/' + obj.id).then(function (resp) {
			obj.upvotes = resp.upvotes;
			obj.downvotes = resp.downvotes;
		});
	}

	$scope.dislike = function (obj, path) {
		vote.dislike(path + '/' + obj.id).then(function (resp) {
			obj.upvotes = resp.upvotes;
			obj.downvotes = resp.downvotes;
		});
	}
});
