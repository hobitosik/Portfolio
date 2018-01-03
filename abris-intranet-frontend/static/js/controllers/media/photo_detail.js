angular.module('myApp').controller('PhotoDetailCtrl',
function ($scope, $rootScope, $state, $http, $q, $filter, $stateParams, jwtHelper, photoAlbum) {
	if (!$stateParams.album_id) {
		$state.go("main.media.photo");
	}

	$scope.popup_it = function (item) {
		$.arcticmodal('close');
		if ($stateParams.id == item.id) {
			$('#arcticmodal-1').arcticmodal();
		} else {
			$state.go('main.media.photo.detail', {album_id: $stateParams.album_id, id: item.id});
		}
	}

	var album = $filter('filter')(photoAlbum, {id: parseInt($stateParams.album_id)}, true)[0];
	if (!album) {
		$state.go("main.media.photo");
		return;
	}

	$scope.title = album.name;
	$scope.content = album.photo_album_items;
	$scope.content.path = 'photo_item';

	$scope.$on('ngRepeatFinished', function () {
		mediaPageScript();
	});

	if ($stateParams.id) {
		$http.get(api + 'photo_item/' + $stateParams.id + '/').then(function (resp) {
			$scope.popup_element = resp.data;
			$scope.popup_element.path = 'photo_item';
			$('#arcticmodal-1').arcticmodal();

			var thisPopupElemIndex;
			for (i = 0; i < $scope.content.length; i++) {
				if ($scope.content[i].id == $stateParams.id) {
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

		var users;
		$q.all([get_replies(), get_users()]).then(function (data) {
			users = data[1];
			generate_comments(data[0], data[1]);
		});
	}

	function get_replies () {
		return $http.get(api + 'photo_item/' + $stateParams.id + '/get_replies/').then(function (resp) {
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

		$http.post(api + 'photo_item/' + $stateParams.id + '/add_comment/', sendIt).then(function (resp) {
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

		$http.post(api + 'photo_item/' + $stateParams.id + '/add_comment/', sendIt).then(function (resp) {
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
//==========================================================================================
	var albums = JSON.parse(localStorage.photo_album);
	$scope.other_albums = [];
	var possibleIndexes = [];
	for (i = 0; i < albums.length; i++) {
		if (albums[i].id == album.id) {
			continue;
		}
		possibleIndexes.push(i);
	}
	while (possibleIndexes.length) {
		if ($scope.other_albums.length == 3) break;

		var _index = getRandomInt(0, possibleIndexes.length - 1);
		var i = possibleIndexes.splice(_index, 1)[0];

		if (!albums[i].photo_album_items.length) {
			continue;
		}

		var obj = {
			id: albums[i].id,
			title: albums[i].name,
			contents: albums[i].photo_album_items.length + ' фото',
			date: moment(albums[i].added).format("DD.MM.YY"),
			image: albums[i].photo_album_items[0].thumbnail,
		}
		$scope.other_albums.push(obj);
	}
});
