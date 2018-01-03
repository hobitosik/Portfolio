angular.module('myApp').controller('AuctionLotsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, lots, countries, categories, companies) {
	if (!lots) {
		$state.go("main.services");
		return;
	}

	$scope.lots = [];
	$scope.infiniteScroll = {
		disabled: true,
		append_data: function append_data () {
			this.disabled = true;
			if (!lots.next) {
				return;
			}
			$http.get(lots.next).then(function (resp) {
				lots.next = resp["data"]["next"];
				lots.previous = resp["data"]["previous"];
				lots.count = resp["data"]["count"];
				lots.results = lots.results.concat(resp["data"]["results"]);

				fetch_data(resp["data"]["results"]);
				this.disabled = false;
			}, function (resp) {
				console.log(resp);
				lots.next = null;
			});
		}
	}
	fetch_data(lots.results);
	$scope.infiniteScroll.disabled = false;

	function fetch_data (data) {
		data.forEach(function (value, index) {
			var obj = {
				id: value.id,
				country: value.country,
				author: {
					id: value.author.id
				},
				upvotes: value.upvotes,
				downvotes: value.downvotes,
				replies: value.replies,
				hits: value.hits,
				category: value.category,
				name: value.name,
				added: value.added,
				text: value.text,
				price: value.price,
				deal_type: value.deal_type,
				company: value.company
			}

			if (value.author.profile) {
				obj.author.name = value.author.profile.first_name + ' ' + value.author.profile.last_name;
			} else {
				obj.author.name = value.author.username;
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

			$scope.lots.push(obj);
		});
	}
//========================================================================================
	$scope.companies = [{name:'Организация', id: -1}].concat(companies);
	$scope.categories = [{name:'Раздел', id: -1}].concat(categories);
	$scope.countries = [{name_ascii:'Страна'}].concat(countries);

	$scope.filter = {
		company: -1,
		country: 'Страна',
		deal_type: "-1",
		category: -1
	}
	$scope.current_company = 'Организация';

	$scope.filterObj = {};

	$scope.apply_comp_filter = function (val) {		
		if (val == -1) {
			delete $scope.filterObj.company;
		} else {
			$scope.filterObj.company = val;
		}
		$scope.current_company = $filter('filter')($scope.companies, {id: val}, true)[0].name;
	}

	$scope.apply_category_filter = function (val) {
		if (val == -1) {
			delete $scope.filterObj.category;
		} else {
			$scope.filterObj.category = val;
		}
	}

	$scope.apply_country_filter = function (val) {
		if (val == 'Страна') {
			delete $scope.filterObj.country;
		} else {
			$scope.filterObj.country = val;
		}
	}

	$scope.apply_deal_type_filter = function (val) {
		if (val == -1) {
			delete $scope.filterObj.deal_type;
		} else {
			$scope.filterObj.deal_type = val;
		}
	}
});