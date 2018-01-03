angular.module('myApp').controller('HomePhotoCtrl',
function ($scope, $rootScope, $state, $stateParams, $q, $http, $filter, jwtHelper, photoAlbum, vote) {
	$scope.$on('ngRepeatFinished', function () {
		mediaPageScript();
	});

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

	items = [];
	photoAlbum.forEach(function (value, index) {
		value.photo_album_items.forEach(function (value1, index1) {
			value1.companies = value.companies;
			items.push(value1);
		});
	});

	var all_content = $filter('orderBy')(items, '+added');

	$scope.companies = [{index: 0, name: "Организация"}];

	$scope.current = {
		company: 0
	}

	if ($stateParams.company) {
		$scope.current.company = parseInt($stateParams.company);
	}

	var allContent;
	$scope.content = [];
	$scope.infiniteScroll = {
		disabled: true,
		append_data: function () {
			this.disabled = true;
			if (!allContent.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.content.push(allContent.pop());
				if (!allContent.length) {
					return;
				}
			}
		}
	}

	$http.get(api + 'companies/').then(function (resp) {
		for (i = 0; i < resp.data.length; i++) {
			$scope.companies.push({index: i + 1, name: resp.data[i].name, id: resp.data[i].id});
		}

		if ($scope.current.company) {
			var _content = $filter('filter')(all_content, {companies: $scope.companies[$scope.current.company].id}, true);
			allContent = $filter('orderBy')(_content, '+added');
		} else {
			allContent = all_content;
		}

		$scope.infiniteScroll.disabled = false;
	}, function (resp) {
		console.log(resp);
	});

	$scope.apply_companies_filter = function (i) {
		$state.go("main.home.media.photo", {company: i});
	};
//==========================================================================================
	$scope.popup_element = null;
	$scope.popup_it = function (item) {
		if ($scope.popup_element && $scope.popup_element.id == item.id) {
			$('#arcticmodal-1').arcticmodal();
		} else {
			pop_it_up(item.id);
		}
	}
	function pop_it_up (id) {
		$http.get(api + 'photo_item/' + id + '/').then(function (resp) {
			$scope.popup_element = resp.data;
			$scope.popup_element.path = 'photo_item';
			$('#arcticmodal-1').arcticmodal();
			var users;
			$q.all([get_replies(), get_users()]).then(function (data) {
				users = data[1];
				generate_comments(data[0], data[1]);
			});

			var thisPopupElemIndex;
			for (i = 0; i < $scope.content.length; i++) {
				if ($scope.content[i].id == $scope.popup_element.id) {
					thisPopupElemIndex = i;
					break;
				}
			}

			switch(thisPopupElemIndex) {
				case 0:
					$scope.popup_element.next = $scope.content[1];
					break;

				case ($scope.content.length - 1):
					$scope.popup_element.prev = $scope.content[$scope.content.length - 2];
					break;

				default:
					$scope.popup_element.prev = $scope.content[thisPopupElemIndex - 1];
					$scope.popup_element.next = $scope.content[thisPopupElemIndex + 1];
					break;
			}
		}, function (resp) {
			console.log(resp);
		});
	}

	function get_replies () {
		return $http.get(api + 'photo_item/' + $scope.popup_element.id + '/get_replies/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}
	function get_users () {
		return $http.get(api + 'users/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}
	function generate_comments (comments, users) {
		$scope.comments = [];
		comments.forEach(function (value, index, array) {
			var author = $filter('filter')(users, {"id": value.user.id}, true)[0];
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
				var author1 = $filter('filter')(users, {"id": value1.user.id}, true)[0];
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

		$http.post(api + 'photo_item/' + $scope.popup_element.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": resp["data"].user.id}, true)[0];
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

			$scope.comments[index].answer_text = '';
			$scope.comments[index].answer = false;
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.make_comment = function () {
		if ($scope.text.commentText == '') {
			return;
		};

		var sendIt = {
			"content": $scope.text.commentText
		}

		$http.post(api + 'photo_item/' + $scope.popup_element.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": resp["data"].user.id}, true)[0];
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

			$scope.text.commentText = '';
		}, function (resp) {
			console.log(resp);
		});
	}
});

angular.module('myApp').controller('HomeVideoPlayerCtrl',
function ($scope, $sce, $state, $http, $stateParams) {
	var controller = this;

	function config_me (videoSrc) {
		controller.config = {
	        preload: "none",
	        sources: [
	            {
	            	src: $sce.trustAsResourceUrl(videoSrc),
	            	type: "video/" + videoSrc.split('.').pop()
	            }
	        ],
	        theme: {
	            url: "static/css/videogular.css"
	        },
	        plugins: {
				poster: ''
	        }
	    };
	}

	$scope.$on('videoSrc', function (e, args) {
		config_me(args);
	});
});

angular.module('myApp').controller('HomeVideoCtrl',
function ($scope, $rootScope, $state, $stateParams, $q, $http, $filter, jwtHelper, videoAlbum, vote) {
	$scope.$on('ngRepeatFinished', function () {
		mediaPageScript();
	});

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

	items = [];
	videoAlbum.forEach(function (value, index) {
		value.video_album_items.forEach(function (value1, index1) {
			value1.companies = value.companies;
			items.push(value1);
		});
	});

	var all_content = $filter('orderBy')(items, '+added');

	$scope.companies = [{index: 0, name: "Организация"}];

	$scope.current = {
		company: 0
	}

	if ($stateParams.company) {
		$scope.current.company = parseInt($stateParams.company);
	}

	var allContent;
	$scope.content = [];
	$scope.infiniteScroll = {
		disabled: true,
		append_data: function () {
			this.disabled = true;
			if (!allContent.length) {
				return;
			}

			for (i = 0; i < 9; i++) {
				$scope.content.push(allContent.pop());
				if (!allContent.length) {
					return;
				}
			}
		}
	}

	$http.get(api + 'companies/').then(function (resp) {
		for (i = 0; i < resp.data.length; i++) {
			$scope.companies.push({index: i + 1, name: resp.data[i].name, id: resp.data[i].id});
		}

		if ($scope.current.company) {
			var _content = $filter('filter')(all_content, {companies: $scope.companies[$scope.current.company].id}, true);
			allContent = $filter('orderBy')(_content, '+added');
		} else {
			allContent = all_content;
		}

		$scope.infiniteScroll.disabled = false;
	}, function (resp) {
		console.log(resp);
	});

	$scope.apply_companies_filter = function (i) {
		$state.go("main.home.media.video", {company: i});
	};
//==========================================================================================
	$scope.popup_element = null;
	$scope.popup_it = function (item) {
		if ($scope.popup_element && $scope.popup_element.id == item.id) {
			$('#arcticmodal-1').arcticmodal();
		} else {
			pop_it_up(item.id);
		}
	}
	function pop_it_up (id) {
		$http.get(api + 'video_item/' + id + '/').then(function (resp) {
			$scope.$broadcast('videoSrc', resp.data.attachment);
			$scope.popup_element = resp.data;
			$scope.popup_element.path = 'video_item';
			$('#arcticmodal-1').arcticmodal();
			var users;
			$q.all([get_replies(), get_users()]).then(function (data) {
				users = data[1];
				generate_comments(data[0], data[1]);
			});

			var thisPopupElemIndex;
			for (i = 0; i < $scope.content.length; i++) {
				if ($scope.content[i].id == $scope.popup_element.id) {
					thisPopupElemIndex = i;
					break;
				}
			}

			switch(thisPopupElemIndex) {
				case 0:
					$scope.popup_element.next = $scope.content[1];
					break;

				case ($scope.content.length - 1):
					$scope.popup_element.prev = $scope.content[$scope.content.length - 2];
					break;

				default:
					$scope.popup_element.prev = $scope.content[thisPopupElemIndex - 1];
					$scope.popup_element.next = $scope.content[thisPopupElemIndex + 1];
					break;
			}
		}, function (resp) {
			console.log(resp);
		});
	}

	function get_replies () {
		return $http.get(api + 'video_item/' + $scope.popup_element.id + '/get_replies/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}
	function get_users () {
		return $http.get(api + 'users/').then(function (resp) {
			return resp["data"];
		}, function (resp) {
			console.log(resp);
			return null;
		});
	}
	function generate_comments (comments, users) {
		$scope.comments = [];
		comments.forEach(function (value, index, array) {
			var author = $filter('filter')(users, {"id": value.user.id}, true)[0];
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
				var author1 = $filter('filter')(users, {"id": value1.user.id}, true)[0];
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

		$http.post(api + 'video_item/' + $scope.popup_element.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": resp["data"].user.id}, true)[0];
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

			$scope.comments[index].answer_text = '';
			$scope.comments[index].answer = false;
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.make_comment = function () {
		if ($scope.text.commentText == '') {
			return;
		};

		var sendIt = {
			"content": $scope.text.commentText
		}

		$http.post(api + 'video_item/' + $scope.popup_element.id + '/add_comment/', sendIt).then(function (resp) {
			var this_author = $filter('filter')(users, {"id": resp["data"].user.id}, true)[0];
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

			$scope.text.commentText = '';
		}, function (resp) {
			console.log(resp);
		});
	}
});
