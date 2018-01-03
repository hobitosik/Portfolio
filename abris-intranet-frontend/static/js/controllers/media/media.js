angular.module('myApp').controller('MediaCtrl',
function ($scope, $rootScope, $state, jwtHelper, $filter, vote) {

	$scope.$on('$stateChangeSuccess',
	function (event, toState, toParams, fromState, fromParams) {
		if (toState.name == 'main.media') {
			$state.go('main.media.photo.album');
		}

		if (toState.name == 'main.media.photo.album') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.media": "Медиа"
			}
			$scope.breadcrumb_active = "Фотографии";
		}

		if (toState.name == 'main.media.video.album') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.media": "Медиа"
			}
			$scope.breadcrumb_active = "Видео";
		}

		if (toState.name == 'main.media.photo.detail') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.media": "Медиа",
				"main.media.photo": "Фотографии"
			}
			var album = JSON.parse(localStorage.photo_album);
			album = $filter('filter')(album, {id: parseInt(toParams.album_id)}, true)[0];
			$scope.breadcrumb_active = album.name.slice(0,16);
			$scope.breadcrumb_active += $scope.breadcrumb_active.length < album.name.length ? '...' : '';
		}

		if (toState.name == 'main.media.video.detail') {
			$scope.breadcrumb = {
				"main.home": "Главная",
				"main.media": "Медиа",
				"main.media.video": "Видео"
			}
			var album = JSON.parse(localStorage.video_album);
			album = $filter('filter')(album, {id: parseInt(toParams.album_id)}, true)[0];
			$scope.breadcrumb_active = album.name.slice(0,16);
			$scope.breadcrumb_active += $scope.breadcrumb_active.length < album.name.length ? '...' : '';
		}

		if (toState.name == 'main.media.photo' || toState.name == 'main.media.video') {
			$state.go(toState.name + '.album');
		}
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
});

function getRandomInt (min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}