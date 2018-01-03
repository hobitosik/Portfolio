angular.module('myApp').controller('AuctionLotsDetailCtrl',
function ($scope, $state, $http, $q, $filter, predicates, jwtHelper, lot, categories) {
	if (!lot)
		$state.go('main.services.auction.lots');

	$scope.lot = lot;
	for (i = 0; i < categories.length; i++) {
		if (categories[i].id === lot.category) {
			$scope.lot.category = categories[i].name;
			break;
		}
	}

	if (lot.main_photo) {
		for (i = 0; i < lot.lot_photos.length; i++) {
			if (lot.lot_photos[i].id === lot.main_photo) {
				(function () {
					var photos = angular.copy(lot.lot_photos);
					$scope.lot.lot_photos = photos.splice(i, 1);
					$scope.lot.lot_photos = $scope.lot.lot_photos.concat(photos);
				})();
				break;
			}
		}
	}

	$scope.replies_predicate = predicates.parse_replies_predicate(lot.replies);
//=====================================================================
	$scope.popped_up = 0;
	$scope.popup = function (index) {
		$scope.popped_up = index;
		$('#arcticmodal-1').arcticmodal();
	}
	
	$scope.popup_next = function () {
		if ($scope.popped_up === lot.lot_photos.length - 1) {
			$scope.popped_up = 0;
		} else {
			++$scope.popped_up;
		}
	}

	$scope.popup_prev = function () {
		if ($scope.popped_up === 0) {
			$scope.popped_up = lot.lot_photos.length - 1;
		} else {
			--$scope.popped_up;
		}
	}
//=====================================================================
	var post_replies = undefined;
	var users = undefined;
	$scope.comments = [];
	$scope.show_comments = false;
	function get_replies () {
		return $http.get(api + 'auction/lot/' + lot.id + '/get_replies/').then(function (resp) {
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
	$scope.get_comments = function () {
		if ($scope.show_comments) {
			return;
		};
		$q.all([get_replies(), get_users()]).then(function (data) {
			post_replies = data[0];
			users = data[1];
	
			generate_comments(post_replies, users);
			$scope.show_comments = true;
			$scope.text = {
				commentText: ''
			};
		});
	}

	function generate_comments (comments, users) {
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

		$http.post(api + 'auction/lot/' + lot.id + '/add_comment/', sendIt).then(function (resp) {
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
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.lot.replies);

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

		$http.post(api + 'auction/lot/' + lot.id + '/add_comment/', sendIt).then(function (resp) {
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
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.lot.replies);

			$scope.text.commentText = '';
		}, function (resp) {
			console.log(resp);
		});
	}
});