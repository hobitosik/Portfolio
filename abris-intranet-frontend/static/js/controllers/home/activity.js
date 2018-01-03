angular.module('myApp').controller('ActivityCtrl',
function ($scope, $state, $http, $filter, jwtHelper, posts, companies, blog, categories, vote, favorites) {
	var token = localStorage.getItem('token');
	if (!token || jwtHelper.isTokenExpired(token))
		return;

	var _blog = [];
	blog.forEach(function (value, index, array) {
		var obj = {
			id: value.id,
			title: value.title,
			text: value.text,
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
		obj.isBlog = true;

		if (value.author && value.author.profile) {
			obj["author"] = {
				id: value.author.id,
				name: value.author.profile.first_name + ' ' + value.author.profile.last_name
			}
		}

		value.category.forEach(function (value1, index1, array1) {
			var cat = $filter('filter')(categories, {"id": value1})[0];
			obj.cats.push({
				id: cat.id,
				name: cat.name
			});
		});

		_blog.push(obj);
	});

	$scope.need_breadcrumb = false;
	var no_vacancies = $filter('filter')(posts, {post_type: "!vacancy"}, true);
	no_vacancies.forEach(function (value, index, array) {
		value.isFavorite = favorites.isFavorite(value, 'post');
	});

	var _allActivity = _blog.concat(no_vacancies);
	_allActivity = $filter('orderBy')(_allActivity, '+added');
	var allActivity = [];

	$scope.$watch('filter_company', function (newValue, oldValue) {
		fetch_filters();
		if (newValue == '-1') {
			$scope.current_company = "Организация";
		} else {
			$scope.current_company = $scope.companies_list[newValue];
		}
	});

	$scope.filter_company = "-1";
	$scope.companies_list = [];
	companies.forEach(function (value, index, array) {
		$scope.companies_list.push(value.name);
	});

	$scope.announce_text = [];

	function fetch_filters () {
		if ($scope.filter_company == "-1") {
			$scope.activity_data = $filter('orderBy')(allActivity, '-added');

			$scope.announce_text = [];
			$scope.activity_data.forEach(function (value, index, array) {
				var no_tags = $filter('limitHtml')(value.text, 512);
				if (index == 1) {console.log(value.text);console.log(no_tags)}
				$scope.announce_text.push(no_tags);
			});
			return;
		};

		var num = parseInt($scope.filter_company);
		var comp_id = companies[num]["id"];
		
		$scope.activity_data = $filter('filter')(allActivity, {"company": comp_id}, true);
		
		$scope.activity_data = $filter('orderBy')($scope.activity_data, '-added');

		$scope.announce_text = [];
		$scope.activity_data.forEach(function (value, index, array) {
			var no_tags = $filter('limitHtml')(value.text, 512);
			$scope.announce_text.push(no_tags);
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

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_allActivity.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				allActivity.push(_allActivity.pop());
				if (!_allActivity.length) {
					fetch_filters();
					return;
				}
			}

			fetch_filters();
			this.disabled = false;
		}
	}
});