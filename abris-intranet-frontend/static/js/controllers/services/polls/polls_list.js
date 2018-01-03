angular.module('myApp').controller('PollsListCtrl',
function ($scope, $state, $http, $filter, companies, jwtHelper, polls) {
	$scope.polls = [];
	var _polls = $filter('orderBy')(polls, '+added');

	$scope.infiniteScroll = {
		disabled: false,
		append_data: function append_data () {
			this.disabled = true;
			if (!_polls.length) {
				return;
			}

			for (i = 0; i < 6; i++) {
				$scope.polls.push(_polls.pop());
				if (!_polls.length) {
					return;
				}
			}
			this.disabled = false;
		}
	}

	$scope.companies = [{name:'Организация', id: -1}].concat(companies);
	$scope.current_company = 'Организация';

	$scope.filter = {
		company: -1
	}

	$scope.filterObj = {};

	$scope.apply_comp_filter = function (val) {
		if (val == -1) {
			delete $scope.filterObj.companies;
		} else {
			$scope.filterObj.companies = val;
		}
		$scope.current_company = $filter('filter')($scope.companies, {id: val}, true)[0].name;
	}
});