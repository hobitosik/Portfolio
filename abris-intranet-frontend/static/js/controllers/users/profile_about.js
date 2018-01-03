angular.module('myApp').controller('ProfileAboutCtrl',
function ($scope, $state, $filter, $http, $q, jwtHelper, Upload, $rootScope, user, positions, departments, statuses) {
	var token = localStorage.getItem('token');

	var decodedToken = jwtHelper.decodeToken(token);
	var my_id = decodedToken['user_id'];
	var passed_id = my_id;
	
	if ($state.params.id.length != 0) {
		passed_id = $state.params.id;
	}

	if (my_id == passed_id) {
		$scope.myProfile = true;
	} else {
		$scope.myProfile = false;
	};

	$scope.statuses = [];
	$scope.my_status = undefined;

	fetch_statuses(statuses);
	fetch_data(positions, departments);

	$scope.set_status = function (id) {
		$scope.my_status = $filter('filter')($scope.statuses, {id:parseInt(id)}, true)[0];
		if (!$scope.my_status) {
			$scope.my_status = $scope.statuses[0];
			id = $scope.statuses[0].id;
		};
		
		if (id == $scope.profile.status) {
			return;
		};
		console.log("setting...");
		$http.patch(api + 'profiles/' + $scope.profile.id + '/', {"user_status": id}).then(function (resp) {
			console.log("status " + $scope.my_status.name + " has been set");
		}, function (resp) {
			console.log(resp);
		});
	}
	$scope.set_status($scope.profile.status);

	function fetch_statuses (statuses) {
		statuses.forEach(function (value, index, array) {
			var obj = {
				id: value.id,
				color: value.color,
				name: value.name,
				element_id: 'status' + value.id + value.color
			}
			$scope.statuses.push(obj);
			var statusElem = '#user-card .left-side .status span#' + obj.element_id + ':before';
			var statusStyle = 'background: #' + obj.color + ';';
			try {
				document.styleSheets[0].addRule(statusElem, statusStyle);
			} catch (err) {
				var rule = statusElem + '{' + statusStyle + '}';
				addStylesheetRule(rule);
			}
		});
	}

	function fetch_data (positions, departments) {
		var thisProfile = user.profile;
		console.log(thisProfile);
		if (thisProfile == undefined) {
			$state.go("main.users.list");
		};

		var thisPosition = $filter("filter")(positions, {"user":{"id": parseInt(passed_id)}}, true)[0];
		if (thisPosition == undefined) {
			thisPosition = {
				"name": ""
			}
		};

		var thisDepartment = $filter('filter')(departments, {"head":{"id": parseInt(passed_id)}}, true)[0];
		if (thisDepartment == undefined) {
			thisDepartment = $filter('filter')(departments, {"employees":{"id": parseInt(passed_id)}}, true)[0];

			if (thisDepartment == undefined) {
				thisDepartment = {
					"name": "",
					"company": {
						"name": ""
					}
				}
			};
		};

		var experience = (moment(thisProfile["work_experience"], 'YYYY-MM-DD').fromNow()).split(' ');
		var working_years = undefined;
		if (experience.length < 3) {
			working_years = '1 ' + experience[0];
		} else {
			working_years = experience[0] + ' ' + experience[1];
		};

		var _about = "<p>" + thisProfile["about"].replace(new RegExp('\n', 'g'), '<br/>') + "</p>";
		var _interests = "<p>" + thisProfile["interests"].replace(new RegExp('\n', 'g'), '<br/>') + "</p>";
		var _education = "<p>" + thisProfile["education"].replace(new RegExp('\n', 'g'), '<br/>') + "</p>";
		var _area_of_responsibility = "<p>" + thisProfile["area_of_responsibility"].replace(new RegExp('\n', 'g'), '<br/>') + "</p>";

		$scope.profile = {
			"id": thisProfile["id"],
			"first_name": thisProfile["first_name"],
			"middle_name": thisProfile["middle_name"],
			"last_name": thisProfile["last_name"],
			"position": thisPosition["name"],
			"company": thisDepartment["company"]["name"],
			"department": thisDepartment["name"],
			"birthday": moment(thisProfile["birth_date"], 'YYYY-MM-DD').format('LL'),
			"working_years": working_years,
			"photo": thisProfile["photo"],
			"email": user["email"],
			"phone": thisProfile["phone"],
			"skype": thisProfile["skype"],
			"mobile_phones": thisProfile["mobile_phones"],
			"emails": thisProfile["email"],
			"home_address": thisProfile["home_address"],
			"facebook": thisProfile["facebook"],
			"linkedin": thisProfile["linkedin"],
			"facebook_fetched": decodeURIComponent(thisProfile["facebook"]),
			"linkedin_fetched": decodeURIComponent(thisProfile["linkedin"]),
			// "achievements": thisProfile["achievements"],
			"about": _about,
			"interests": _interests,
			"education": _education,
			"area_of_responsibility": _area_of_responsibility,
			"status": thisProfile["user_status"]
		};
		if ($scope.profile.birthday == 'Invalid date') {
			$scope.profile.birthday = '';
		}

		$http.get(api + 'profiles/' + thisProfile["id"] + '/get_achievement/').then(function (resp) {
			$scope.profile.achievements = resp["data"];
		}, function (resp) {
			console.log(resp["data"]);
		});
	};

	$scope.image = {
		originalImage: '',
		croppedImage: ''
	}

	$scope.changeAvatar = function (file) {
	    var reader = new FileReader();
	    reader.onload = function(event) {
		    $scope.$apply(function(){
		    	$scope.image.originalImage = event.target.result;
		    });

		    setTimeout(function () {
		    	Upload.upload({
		            url: api + "profiles/" + $scope.profile.id + "/",
		            data: {"photo": dataURItoBlob($scope.image.croppedImage)},
		            method: 'PATCH'
		        }).then(function (resp) {
		            
		            $http.get(api + "users/" + my_id + '/').then(function (resp) {
						var data = resp["data"];

						$scope.profile["photo"] = data.profile.photo;

						$rootScope.$broadcast('avatar.changed', $scope.profile["photo"]);
					}, function (resp) {
						console.log(resp);
					});

		        }, function (resp) {
		            console.log(resp);
		        });
		    }, 500);
	    };
	    reader.readAsDataURL(file);
	}
});