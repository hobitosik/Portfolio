angular.module('myApp').controller('ProfileFavoritesCtrl',
function ($scope, $state, jwtHelper, favorites) {
	var token = localStorage.getItem('token');
	if ($state.params.id != jwtHelper.decodeToken(token)['user_id']) {
		$state.go("main.users.profile.about");
		return;
	}
	
	$scope.favs = [];
	var _favs = [];
	favorites.get().forEach(function (value, index) {
		if (!value.content_object)
			return;

		var _text = value.content_object.text || value.content_object.description || value.content_object.content;
		var obj = {
			id: value.content_object.id,
			href: favorites.get_href(value),
			title: value.content_object.title || value.content_object.name,
			text: strip_html(_text).slice(0, 128) + '...',
			image: value.content_object.image || value.content_object.photo,
			date: moment(value.content_object.added).format("DD.MM.YYYY"),
			upvotes: value.content_object.upvotes,
			downvotes: value.content_object.downvotes,
			hits: value.content_object.hits,
			replies: value.content_object.replies,
			path: value.path,
			isFavorite: true
		}

		_favs.push(obj);
	});

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_favs.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.favs.push(_favs.pop());
				if (!_favs.length) {
					return;
				}
			}
			this.disabled = true;
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