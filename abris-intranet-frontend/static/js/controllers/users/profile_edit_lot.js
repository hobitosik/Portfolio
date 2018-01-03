angular.module('myApp').controller('ProfileEditLotCtrl',
function ($scope, $state, $http, $filter, jwtHelper, user, lot, categories, countries, Upload) {
	var token = localStorage.getItem('token');

	if (jwtHelper.decodeToken(token)['user_id'] !== user.id) {
		$state.go("main.users.profile", {id: user.id});
	}

	var deleted_photos = [];

	$scope.categories = categories;
	$scope.countries = countries;
	$scope.lot = lot;
	$scope.get_this_cat = function (id) {
		var cat = $filter('filter')(categories, {id: id}, true)[0];
		return cat.name;
	}

	$scope.cancel = function () {
		$state.go("main.users.profile.lots", {id: user.id});
	}

	$scope.new_images = [];
	$scope.main_photo = null;
	$scope.imagesUploaded = function (files) {
		if (!files || !files.length) return;

		files.forEach(function (value, index) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$scope.$apply(function(){
					$scope.new_images.push(e.target.result);
				});
		    };
		    reader.readAsDataURL(value);
		});
	}
	$scope.make_main = function (index) {
		$scope.lot.main_photo = null;
		$scope.main_photo = index;
	}
	$scope.remove_photo = function (index) {
		$scope.new_images.splice(index, 1);
		if (index == $scope.main_photo) {
			$scope.main_photo = null;
		}
	}

	$scope.make_main_existing = function (id) {
		$scope.lot.main_photo = id;
		$scope.main_photo = null;
	}
	$scope.remove_photo_existing = function (index) {
		if ($scope.lot.lot_photos[index].id == $scope.lot.main_photo) {
			$scope.lot.main_photo = null;
		}

		var deleted = $scope.lot.lot_photos.splice(index, 1)[0];
		deleted_photos.push(emulate_deletion(deleted.id));
	}

	$scope.modify_lot = function () {
		if (!$scope.lot.name || !$scope.lot.price || !$scope.lot.text) {
			$scope.err = true;
			return;
		}
		$scope.err = false;
		if (deleted_photos.length) {
			for (i = 0; i < deleted_photos.length; i++) {
				deleted_photos[i]();
			}
		}
		var obj = {
			name: $scope.lot.name,
			price: $scope.lot.price,
			category: $scope.lot.category,
			deal_type: $scope.lot.deal_type,
			country: $scope.lot.country,
			text: $scope.lot.text,
			main_photo: $scope.lot.main_photo
		}

		if ($scope.new_images.length) {
			var _new_images = angular.copy($scope.new_images);
			if ($scope.main_photo) {
				obj.main_photo = dataURItoBlob(_new_images.splice($scope.main_photo, 1)[0]);
			}

			for (i = 0; i < _new_images.length; i++) {
				obj['lot_photos_' + i] = dataURItoBlob(_new_images[i]);
			}

			Upload.upload({
				url: api + 'auction/lot/' + lot.id + '/',
				data: obj,
				method: "PATCH",
				arrayKey: ''
			}).then(function (resp) {
				$state.go("main.users.profile.lots", {id: user.id});
			}, function (resp) {
				$scope.err = true;
				console.log(resp);
			});
		} else {
			$http.patch(api + 'auction/lot/' + lot.id + '/', obj).then(function (resp) {
				$state.go("main.users.profile.lots", {id: user.id});
			}, function (resp) {
				$scope.err = true;
				console.log(resp);
			});
		}
	}

	function emulate_deletion (id) {
		return function () {
			return $http.delete(api + 'auction/lot/' + lot.id + '/delete_photo/' + id + '/');
		}
	}
});