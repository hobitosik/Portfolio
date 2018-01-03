angular.module('myApp').controller('PollsDetailQuestionsCtrl',
function ($scope, $state, $http, $filter, jwtHelper, poll) {
	$scope.poll_questions = $filter('orderBy')(poll.poll_questions, 'ordering');

	function check_for_answers () {
		for (i = 0; i < poll.poll_questions.length; i++) {
			if(!poll.poll_questions[i].answered)
				return false;
		}
		return true;
	}

	$scope.go_to_question = function (num) {
		$scope.input = {
			checkbox: {},
			user_answer: ""
		};
		if (num == poll.poll_questions.length) {
			if (check_for_answers()) {
				poll.answered = true;
				$state.go("main.services.polls.detail.result");
			} else {
				$scope.go_to_question(0);
			}
		} else if ($scope.poll_questions[num].answered) {
			$scope.go_to_question(num + 1);
		} else {
			$scope.current_question = num;
		}
	}

	$scope.next_question = function () {
		var obj = form_answer_obj();
		console.log(obj);

		if (Array.isArray(obj) && obj.length || obj.choice || obj.text) {
			poll.poll_questions[$scope.current_question].answered = true;
		}
		
		if (Array.isArray(obj)) { // if checkboxes
			
			for (i = 0; i < obj.length; i++) {
				send_answer(obj[i]);
			}

			if (obj.length) {
				$scope.go_to_question($scope.current_question + 1);
			}
			
			return;
		}
		
		send_answer(obj);
		$scope.go_to_question($scope.current_question + 1);
	}

	$scope.go_to_question(0);

	function send_answer (obj) {
		$http.post(api + '/poll/' + poll.id + '/answer/', obj).then(function (resp) {
			console.log(resp);
		}, function (resp) {
			console.log(resp);
		});
	}

	$scope.input = {
		checkbox: {},
		user_answer: ""
	};

	function form_answer_obj () {
		if ($scope.poll_questions[$scope.current_question].multiple_answers) {
			var obj_arr = [];
			for (key in $scope.input.checkbox) {
				if (!$scope.input.checkbox[key]) continue;
				var obj = {
					"question": $scope.poll_questions[$scope.current_question].id,
					"choice": parseInt(key)
				}
				obj_arr.push(obj);
			}

			if ($scope.poll_questions[$scope.current_question].user_choices && $scope.input.user_answer) {
				var obj = {
					"text": $scope.input.user_answer,
					"question": $scope.poll_questions[$scope.current_question].id
				}

				obj_arr.push(obj);
			}

			return obj_arr;
		}

		if ($scope.poll_questions[$scope.current_question].user_choices && $scope.input.user_answer) {
			var obj = {
				"text": $scope.input.user_answer,
				"question": $scope.poll_questions[$scope.current_question].id
			}

			return obj;
		}

		if (!$scope.poll_questions[$scope.current_question].multiple_answers) {
			var obj = {
				"question": $scope.poll_questions[$scope.current_question].id,
				"choice": parseInt($scope.input.radio)
			}
			return obj;
		}
	}
});