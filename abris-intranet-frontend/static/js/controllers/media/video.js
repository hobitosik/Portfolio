angular.module('myApp').controller('VideoCtrl',
function ($scope, $rootScope, $state, $http, $filter, jwtHelper, videoAlbum) {
	if (!videoAlbum) {
		console.log("Video Albums unavailable!");
		$state.go("main.home");
	}

	$scope.$on('ngRepeatFinished', function () {
		mediaPageScript();
	});

	localStorage.video_album = JSON.stringify(videoAlbum);

	var albums = {};
	videoAlbum.forEach(function (value, index) {
		if (value.video_album_items.length == 0) return;
		var randInt = getRandomInt(0, value.video_album_items.length - 1);
		var obj = {
			id: value.id,
			title: value.name,
			contents: value.video_album_items.length + ' видео',
			date: moment(value.added).format("DD.MM.YY"),
			added: value.added,
			companies: value.companies,
			image: value.video_album_items[randInt].attachment + '.jpg'
		}

		var year = moment(value.added).format("YYYY");
		if (!(year in albums)) {
			albums[year] = [];
		}
		albums[year].push(obj);
	});

	var years = Object.keys(albums).sort(function (a, b) {
		return b - a;
	});

	$scope.albums = {};
	for (i = 0; i < years.length; i++) {
		$scope.albums[years[i]] = $filter('orderBy')(albums[years[i]], '-added');
	}

	$scope.current = {
		year: 0,
		company: 0
	}
	$scope.filterObj = {};

	$scope.years = [{index: 0, num: "Год"}];
	for (i = 2016, j = 1; i <= parseInt(moment().format('YYYY')); i++, j++) {
		$scope.years.push({index: j, num: i});
	}

	$scope.companies = [{index: 0, name: "Организация"}];
	$http.get(api + 'companies/').then(function (resp) {
		for (i = 0; i < resp.data.length; i++) {
			$scope.companies.push({index: i + 1, name: resp.data[i].name, id: resp.data[i].id});
		}
	}, function (resp) {
		console.log(resp);
	});

	$scope.apply_years_filter = function (i) {
		if (i) {
			var obj = {};
			obj[$scope.years[i].num] = $scope.albums[$scope.years[i].num];
			$scope.albums = obj;
			return;
		}

		$scope.albums = {};
		for (i = 0; i < years.length; i++) {
			$scope.albums[years[i]] = $filter('orderBy')(albums[years[i]], '-added');
		}
	};

	$scope.apply_companies_filter = function (i) {
		if (i) {
			$scope.filterObj.companies = $scope.companies[i].id;
			return;
		}

		delete $scope.filterObj.companies;
	};

	$scope.years_limit = 1;
	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if ($scope.years_limit > years.length) {
				return;
			}
			$scope.years_limit++;
			this.disabled = false;
		}
	}
});