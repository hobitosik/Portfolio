angular.module('myApp').controller('ProfileLotsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, user, lots, categories) {
	var token = localStorage.getItem('token');
	$scope.myProfile = user.id == jwtHelper.decodeToken(token)['user_id'];
	
	function get_category (id) {
		var cat = $filter('filter')(categories, {id: id}, true)[0];
		return cat.name;
	}

	$scope.lots = [];
	var _lots = [];
	lots.forEach(function (value, index) {
		var obj = {
			id: value.id,
			country: value.country,
			category: get_category(value.category),
			name: value.name,
			added: value.added,
			date: moment(value.added).format('DD.MM.YYYY'),
			text: value.text,
			price: value.price,
			deal_type: value.deal_type
		}

		if (value.main_photo) {
			for (var i = 0; i < value.lot_photos.length; i++) {
				if (value.lot_photos[i].id === value.main_photo) {
					obj.main_photo = value.lot_photos.splice(i, 1)[0];
					break;
				}
			}
		} else {
			obj.main_photo = value.lot_photos.splice(0, 1)[0];
		}

		_lots.push(obj);
	});
	_lots = $filter('orderBy')(_lots, '+added');

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_lots.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.lots.push(_lots.pop());
				if (!_lots.length) {
					return;
				}
			}
			this.disabled = false;
		}
	}

	$scope.delete_lot = function (index) {
		$http.delete(api + 'auction/lot/' + $scope.lots[index].id + '/').then(function (resp) {
			console.log(resp);
			$scope.lots.splice(index, 1);
		}, function (resp) {
			console.log(resp);
		});
	}
});