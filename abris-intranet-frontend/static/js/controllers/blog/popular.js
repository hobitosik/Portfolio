angular.module('myApp').controller('BlogPopularCtrl',
function ($scope, $state, $filter, $http, jwtHelper, vote, favorites, blog, categories) {
	$scope.categories = categories;

	$scope.blog = [];
	var _blog = [];
	blog.forEach(function (value, index, array) {
		var obj = {
			id: value.id,
			title: value.title,
			text: strip_html(value.text).slice(0, 512) + '...',
			img: value.image,
			date: moment(value.added).format("DD.MM.YYYY"),
			added: value.added,
			cats: [],
			upvotes: value.upvotes,
			downvotes: value.downvotes,
			hits: value.hits,
			replies: value.replies,
			company: value.company
		}
		obj.isFavorite = favorites.isFavorite(obj, 'blog');

		if (value.author && value.author.profile) {
			obj["author"] = {
				id: value.author.id,
				name: value.author.profile.first_name + ' ' + value.author.profile.last_name
			}
		}

		value.category.forEach(function (value1, index1, array1) {
			var cat = $filter('filter')($scope.categories, {"id": parseInt(value1)}, true)[0];
			obj.cats.push({
				id: cat.id,
				name: cat.name
			});
		});

		_blog.push(obj);
	});

	_blog = $filter('orderBy')(_blog, '+replies');

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_blog.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.blog.push(_blog.pop());
				if (!_blog.length) {
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