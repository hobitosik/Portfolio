angular.module('myApp').controller('AuctionAddLotCtrl',
function ($scope, $state, $http, $filter, jwtHelper, categories, countries, Upload) {
	$scope.photos = [];
	$scope.main_photo = -1;
	$scope.lot = {
		category: -1,
		country: '- не выбрано -',
		deal_type: "-1",
		_deal_type: "- не выбрано -"
	};

	$scope.$watch('lot.deal_type', function (newValue, oldValue) {
		if (newValue == '0') {
			$scope.lot._deal_type = 'Покупка';
			return;
		}

		if (newValue == '1') {
			$scope.lot._deal_type = 'Продажа';
			return;
		}

		if (newValue == '-1') {
			$scope.lot._deal_type = '- не выбрано -';
			return;
		}
	});

	$scope.categories = [{name:'- не выбрано -', id: -1}].concat(categories);
	$scope.countries = [{name_ascii:'- не выбрано -'}].concat(countries);

	$scope.imagesUploaded = function (files) {
		if (!files || !files.length) return;

		files.forEach(function (value, index) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$scope.$apply(function(){
					$scope.photos.push(e.target.result);
				});
		    };
		    reader.readAsDataURL(value);
		});
	}

	$scope.make_main = function (index) {
		$scope.main_photo = index;
	}

	$scope.remove_photo = function (index) {
		$scope.photos.splice(index, 1);
		if (index == $scope.main_photo) {
			$scope.main_photo = -1;
		}
	}

	$scope.cancel = function () {
		$state.go("main.services.auction");
	}

	$scope.err = false;
	var lock = false;
	$scope.create_lot = function () {
		if (lock) return;
		lock = true;
		$scope.err = false;
		var lot = $scope.lot;
		var photos = angular.copy($scope.photos);
		if (lot.country == '- не выбрано -' || !lot.name || !lot.text || !lot.price || lot.deal_type == -1 || !photos.length || lot.category == -1) {
			$scope.err = true;
			return;
		}

		if ($scope.main_photo != -1) {
			lot.main_photo = dataURItoBlob(photos.splice($scope.main_photo, 1)[0]);
		}

		for (i = 0; i < photos.length; i++) {
			lot["lot_photos_" + i] = dataURItoBlob(photos[i]);
		}

		if (lot.deal_type == 0) {
			lot.deal_type = 'purchase';
		} else if (lot.deal_type == 1) {
			lot.deal_type = 'selling';
		}

		Upload.upload({
			url: api + 'auction/lot/',
			data: lot,
			method: "POST",
			arrayKey: ''
		}).then(function (resp) {
			$state.go("main.services.auction");
		}, function (resp) {
			lock = false;
			console.log(resp);
		});
	}
});