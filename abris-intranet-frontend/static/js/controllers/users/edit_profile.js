angular.module('myApp').controller('EditProfileCtrl',
function ($scope, $state, $http, $filter, jwtHelper, Upload, $rootScope) {
	var token = localStorage.getItem('token');
	
	var decodedToken = jwtHelper.decodeToken(token);
	var my_id = decodedToken['user_id'];

	$scope.breadcrumb_active = "Редактирование профиля";
	$scope.breadcrumb = {
		'main.home': 'Главная'
	};
	$scope.breadcrumb['main.users.profile({id:'+my_id+'})'] = 'Личный кабинет';

	$scope.photo_preview = "static/images/photo_upload.png";

	var profileData = undefined;
	
	$http.get(api + 'users/' + my_id + '/').then(function (resp) {
		fetch_data(resp['data']['profile']);
	}, function (resp) {
		console.log(resp);
	});

	function fetch_data (thisProfile) {
		if (thisProfile == undefined) {
			$state.go("main.users.list");
		};

		profileData = thisProfile;

		$scope.profile_first_name = profileData["first_name"];
		$scope.profile_last_name = profileData["last_name"];
		$scope.profile_middle_name = profileData["middle_name"];
		$scope.profile_mobile_phones = profileData["mobile_phones"];
		$scope.profile_emails = profileData["email"];
		$scope.profile_phone = profileData["phone"];
		$scope.profile_skype = profileData["skype"];
		$scope.profile_about = profileData["about"];
		$scope.profile_interests = profileData["interests"];
		$scope.profile_education = profileData["education"];
		$scope.profile_area_of_responsibility = profileData["area_of_responsibility"];
		$scope.profile_facebook = profileData["facebook"];
		$scope.profile_linkedin = profileData["linkedin"];
		$scope.profile_home_address = profileData["home_address"];
		$scope.subscribe_to_posts = profileData["subscribe_to_posts"];
		$scope.subscribe_to_events = profileData["subscribe_to_events"];
		$scope.subscribe_to_polls = profileData["subscribe_to_polls"];

		if (profileData["birth_date"] != undefined) {
			$scope.profile_birth_date = moment(profileData["birth_date"], 'YYYY-MM-DD').format('DD.MM.YYYY');
		} else {
			$scope.profile_birth_date = moment().format('DD.MM.YYYY');
		}

		if (profileData["work_experience"] != undefined) {
			$scope.profile_dateStart = moment(profileData["work_experience"], 'YYYY-MM-DD').format('DD.MM.YYYY');
		} else {
			$scope.profile_dateStart = moment().format('DD.MM.YYYY');
		}

		if ($scope.profile_emails[0] == undefined) {
			$scope.profile_emails[0] = '';
		};

		if ($scope.profile_mobile_phones[0] == undefined) {
			$scope.profile_mobile_phones[0] = '';
		};
	};

	$scope.removePhone = function (i) {
		$scope.profile_mobile_phones.splice(i, 1);

		if ($scope.profile_mobile_phones[0] == undefined) {
			$scope.profile_mobile_phones[0] = '';
		};
	};

	$scope.addPhone = function () {
		$scope.profile_mobile_phones.push('');
	}

	$scope.removeEmail = function (i) {
		$scope.profile_emails.splice(i, 1);

		if ($scope.profile_emails[0] == undefined) {
			$scope.profile_emails[0] = '';
		};
	}

	$scope.addEmail = function () {
		$scope.profile_emails.push('');
	}

	$scope.cancelChanges = function () {
		$scope.profile_first_name = profileData["first_name"];
		$scope.profile_last_name = profileData["last_name"];
		$scope.profile_middle_name = profileData["middle_name"];
		$scope.profile_mobile_phones = profileData["mobile_phones"];
		$scope.profile_emails = profileData["email"];
		$scope.profile_phone = profileData["phone"];
		$scope.profile_skype = profileData["skype"];
		$scope.profile_about = profileData["about"];
		$scope.profile_interests = profileData["interests"];
		$scope.profile_education = profileData["education"];
		$scope.profile_area_of_responsibility = profileData["area_of_responsibility"];
		$scope.profile_facebook = profileData["facebook"];
		$scope.profile_linkedin = profileData["linkedin"];
		$scope.profile_home_address = profileData["home_address"];
		$scope.subscribe_to_posts = profileData["subscribe_to_posts"];
		$scope.subscribe_to_events = profileData["subscribe_to_events"];
		$scope.subscribe_to_polls = profileData["subscribe_to_polls"];

		if (profileData["birth_date"] != undefined) {
			$scope.profile_birth_date = moment(profileData["birth_date"], 'YYYY-MM-DD').format('DD.MM.YYYY');
		} else {
			$scope.profile_birth_date = moment().format('DD.MM.YYYY');
		}

		if (profileData["work_experience"] != undefined) {
			$scope.profile_dateStart = moment(profileData["work_experience"], 'YYYY-MM-DD').format('DD.MM.YYYY');
		} else {
			$scope.profile_dateStart = moment().format('DD.MM.YYYY');
		}

		if ($scope.profile_emails[0] == undefined) {
			$scope.profile_emails[0] = '';
		};

		if ($scope.profile_mobile_phones[0] == undefined) {
			$scope.profile_mobile_phones[0] = '';
		};

		$scope.file = undefined;

		$scope.image = {
			originalImage: '',
			croppedImage: ''
		}

		$scope.show_cropped_img = false;
	}

	$scope.savePersonalData = function () {
		// var _bDay = $scope.profile_birth_date.split('.');
		// var bDay = _bDay[2] + '-' + _bDay[1] + '-' + _bDay[0];

		// var _dateStart = $scope.profile_dateStart.split('.');
		// var dateStart = _dateStart[2] + '-' + _dateStart[1] + '-' + _dateStart[0];
		
		var prof_data = {
			"phone": $scope.profile_phone,
		    "skype": $scope.profile_skype,
		    "first_name": $scope.profile_first_name,
		    "middle_name": $scope.profile_middle_name,
		    "last_name": $scope.profile_last_name,
		    "birth_date": moment($scope.profile_birth_date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
		    "work_experience": moment($scope.profile_dateStart, 'DD.MM.YYYY').format('YYYY-MM-DD'),
		}

		$http.patch(api + "profiles/" + profileData["id"] + "/", prof_data).then(function (argument) {
			$state.go("main.users.profile", {id:my_id});
		}, function (argument) {
			console.log(argument);
		});
	};

	$scope.saveAdditionalContacts = function () {
		var my_mobile_phones = [];
		var my_emails = [];

		$scope.profile_mobile_phones.forEach(function (value, index, array) {
			if (value != '') {
				my_mobile_phones.push(value);
			};
		});
		
		$scope.profile_emails.forEach(function (value, index, array) {
			if (value != '') {
				my_emails.push(value);
			};
		});

		var add_contacts = {
			"mobile_phones": my_mobile_phones,
			"email": my_emails,
			"facebook": $scope.profile_facebook,
			"linkedin": $scope.profile_linkedin,
			"home_address": $scope.profile_home_address
		}

		$http.patch(api + "profiles/" + profileData["id"] + "/", add_contacts).then(function (argument) {
			$state.go("main.users.profile", {id:my_id});
		}, function (argument) {
			console.log(argument);
		});
	}

	$scope.wrong_pass_confirmation = false;
	$scope.wrong_old_pass = false;
	$scope.changePassword = function () {
		if ($scope.new_password != $scope.confirm_password) {
			$scope.wrong_pass_confirmation = true;
			return;
		}
		$scope.wrong_pass_confirmation = false;
		$scope.wrong_old_pass = false;

		$http.post(api + 'profiles/password_reset/', {
			new_password: $scope.new_password,
			current_password: $scope.old_password
		}).then(function (resp) {
			$state.go("main.users.profile", {id:my_id});
		}, function (resp) {
			$scope.wrong_old_pass = true;
			console.log(resp);
		});
	}

	$scope.saveMoreInfo = function () {
		var data = {
		    "about": $scope.profile_about,
		    "education": $scope.profile_education,
		    "interests": $scope.profile_interests,
		    "area_of_responsibility": $scope.profile_area_of_responsibility
		}

		$http.patch(api + "profiles/" + profileData["id"] + "/", data).then(function (argument) {
			$state.go("main.users.profile", {id:my_id});
		}, function (argument) {
			console.log(argument);
		});
	};

	$scope.saveSubscriptions = function () {
		$http.patch(api + "profiles/" + profileData["id"] + "/", {
			subscribe_to_posts: $scope.subscribe_to_posts,
			subscribe_to_polls: $scope.subscribe_to_polls,
			subscribe_to_events: $scope.subscribe_to_events
		}).then(function (resp) {
			$state.go("main.users.profile", {id:my_id});
		}, function (resp) {
			console.log(resp);
		});
	};


	$scope.image = {
		originalImage: '',
		croppedImage: ''
	}

	$scope.show_cropped_img = false;

	$scope.showThumbnail = function () {

		var reader = new FileReader();
	    reader.onload = function(event) {
		    $scope.$apply(function(){
		    	$scope.image.originalImage = event.target.result;
		    	$scope.show_cropped_img = true;
		    });
	    };
	    reader.readAsDataURL($scope.file);
	    
	}

	$scope.uploadPhoto = function () {
		if ($scope.file) {
	    	$scope.upload(dataURItoBlob($scope.image.croppedImage));
	    }
	};

	$scope.upload = function (file) {
		var new_photo = undefined;

        Upload.upload({
            url: api + "profiles/" + profileData["id"] + "/",
            data: {"photo": file},
            method: 'PATCH'
        }).then(function (resp) {
	            
	        $http.get(api + "users/" + my_id + '/').then(function (resp) {
				var data = resp["data"];
				new_photo = resp["data"]["profile"]["photo"];

				$rootScope.$broadcast('avatar.changed', new_photo);

				$state.go("main.users.profile", {id:my_id});
			}, function (resp) {
				console.log(resp);
			});

	    }, function (resp) {
        	console.log(resp);
        });
    };
});