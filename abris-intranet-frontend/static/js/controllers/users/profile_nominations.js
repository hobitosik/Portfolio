angular.module('myApp').controller('ProfileNominationsCtrl',
function ($scope, $state, $filter, jwtHelper, nominations, vote) {
	var user_id = $state.params.id;
	var _nominations = $filter('filter')(nominations, {user: {id: parseInt(user_id)}}, true);
	_nominations = $filter('orderBy')(_nominations, '+added');
	$scope.nominations = [];

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_nominations.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.nominations.push(_nominations.pop());
				if (!_nominations.length) {
					return;
				}
			}
			this.disabled = false;
		}
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