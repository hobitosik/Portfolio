angular.module('myApp').controller('BlogAddPostCtrl',
function ($scope, $state, $http, jwtHelper, Upload, blog) {
	$scope.tinymceOptions = {
		skin: 'bewites',
		plugins: 'link image attach',
		menubar: false,
		height:200,
		toolbar: 'bold | italic | underline | strikethrough | bullist | numlist | image | attach | link | trash',
		setup: setupFunction
	};

	function setupFunction (editor) {
		editor.addButton('trash', {
			title: 'Очистить все',
			icon: 'icon-trash',
			onclick: function () {
				editor.setContent('');
			}
		});
	}

	$scope.post = {
		title: "",
		text: "",
		image: null
	}

    $scope.imageUploaded = function (file) {
    	var reader = new FileReader();
		reader.onload = function (e) {
			$scope.$apply(function(){
				$scope.post.image = e.target.result;
			});
	    };
	    reader.readAsDataURL(file);
    }

	$scope.categories = JSON.parse(localStorage.blog_categories);

	$scope.add_post = function () {
		var obj = {
			title: $scope.post.title,
			text: $scope.post.text
		}

		if ($scope.selected_cats && $scope.selected_cats.length) {
			obj["category"] = $scope.selected_cats;
		}

		if ($scope.post.image) {
			obj["image"] = dataURItoBlob($scope.post.image);
		}

		Upload.upload({
			url: api + 'blog/',
			data: obj,
			method: "POST",
			arrayKey: ''
		}).then(function (resp) {
			blog.push(resp["data"]);

			$state.go("main.blog.latest");
		}, function (resp) {
			console.log(resp);
		});
	}
});