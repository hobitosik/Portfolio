angular.module('myApp').controller('EventsDetailCtrl',
function ($scope, $state, $http, $q, $filter, jwtHelper, event, vote, predicates, favorites) {
	var id = jwtHelper.decodeToken(localStorage.getItem('token'))["user_id"];
	$scope.invitations = false;

	var isInvited = $filter('filter')(event.invitations, {id:id}, true).length > 0;
	var hasAccepted = $filter('filter')(event.invitations_accepted, {id:id}, true).length > 0;
	var hasDeclined = $filter('filter')(event.invitations_declined, {id:id}, true).length > 0;

	$scope.data = {
		id: event.id,
		title: event.title,
		text: event.text,
		invitations: event.invitations,
		invitations_accepted: event.invitations_accepted,
		invitations_declined: event.invitations_declined,
		invited_count: event.invitations.length + event.invitations_accepted.length + event.invitations_declined.length,
		date: moment(event.date).format("DD.MM.YYYY"),
		_date: moment(event.date).format('dddd, DD MMMM YYYY'),
		_time: moment(event.date).format('HH:mm'),
		upvotes: event.upvotes,
		downvotes: event.downvotes,
		hits: event.hits,
		replies: event.replies,
		replies_predicate: predicates.parse_replies_predicate(event.replies),
		image: event.image,
		accepted: hasAccepted,
		invited: isInvited,
		declined: hasDeclined,
	}
	if (event.time_zone != null) {
		$scope.data._time = moment.tz(event.date.replace('Z', ''), event.time_zone).format("HH:mm");
	}
	$scope.data.isFavorite = favorites.isFavorite($scope.data, 'event');

	$scope.show_invitations = function () {
		$scope.invitations = !$scope.invitations;
	}

	$scope.accept = function () {
		$http.post(api + 'event/' + $scope.data.id + '/accept/').then(function (resp) {
			$scope.data.declined = false;
			$scope.data.accepted = true;
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.decline = function () {
		$http.post(api + 'event/' + $scope.data.id + '/decline/').then(function (resp) {
			$scope.data.accepted = false;
			$scope.data.declined = true;
		}, function (resp) {
			console.log(resp);
		});
	}

//=====================================================================
	var post_replies = undefined;
	var users = undefined;
	$scope.comments = [];
	$scope.show_comments = false;
	function get_replies () {
		return $http.get(api + 'event/' + event.id + '/get_replies/').then(function (resp) {
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

		$http.post(api + 'event/' + event.id + '/add_comment/', sendIt).then(function (resp) {
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
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.data.replies);

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

		$http.post(api + 'event/' + event.id + '/add_comment/', sendIt).then(function (resp) {
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
			$scope.replies_predicate = predicates.parse_replies_predicate(++$scope.data.replies);

			$scope.text.commentText = '';
		}, function (resp) {
			console.log(resp);
		});
	}
//=====================================================================
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