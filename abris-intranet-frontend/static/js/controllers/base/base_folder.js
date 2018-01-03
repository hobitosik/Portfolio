angular.module('myApp').controller('BaseFolderCtrl',
function ($scope, $state, $http, $filter, jwtHelper, predicates, lang_code) {
	var token = localStorage.getItem('token');
	
	$scope.breadcrumb_active = "";
	$scope.breadcrumb = {
		'main.home': 'Главная',
		'main.base': 'База знаний'
	};

	parse_folder(JSON.parse(localStorage.wiki));

	function find_my_folder (cats, index_arr, level) {
		if (level == 0) {
			return cats[index_arr[0]];
		};
		var my_children = cats[index_arr[0]].children;

		for(i = 1; i < level; i++) {
			my_children = my_children[index_arr[i]].children;
		}

		var my_folder = my_children[index_arr[level]];

		return my_folder;
	}

	function parse_folder (cats) {
		var folder = find_my_folder(cats, $state.params.index_arr, $state.params.level);
		if (folder == undefined) {
			return;
		};

		localStorage.setItem('folderArticles', JSON.stringify(folder.wiki_article_items));

		var obj = {
			name: folder.name,
			sub_folders: [],
			files: [],
			articles: []
		}

		if (lang_code.get_locale() == 'en') {
			obj.name = folder.name_en || folder.name;
		}

		folder.children.forEach(function (value1, index1, array1) {
			// build folders array
			var folders_count = value1.children.length;
			var wiki_article_items_count = value1.wiki_article_items.length;

			var wiki_article_items_predicate = predicates.parse_articles_predicate(wiki_article_items_count);
			var folders_predicate = predicates.parse_folders_predicate(folders_count);

			if (folders_count == 0) {
				folders_count = '';
				folders_predicate = '';
			};

			if (wiki_article_items_count == 0) {
				wiki_article_items_count = '';
				wiki_article_items_predicate = '';
			};

			var arr = $state.params.index_arr;
			if ($state.params.level == 0) {
				arr = [];
				arr.push($state.params.index_arr);
			};
			arr.push(index1);
			var sub_folder = {
				name: value1.name,
				info: folders_count + folders_predicate + ' ' + wiki_article_items_count + wiki_article_items_predicate,
				level: value1.level,
				index_arr: arr
			}

			if (lang_code.get_locale() == 'en') {
				sub_folder.name = value1.name_en || value1.name;
			}

			obj.sub_folders.push(sub_folder);
		}); // foreach folder

		folder.wiki_article_items.forEach(function (value1, index1, array1) {
			// build articles array
			var article = {
				name: value1.name,
				id: value1.id,
				type: 'txt',
				info: '',
				url: '',
				details: value1.description,
				ordering: parseInt(value1.ordering)
			}

			if (lang_code.get_locale() == 'en') {
				article.name = value1.name_en || value1.name;
			}

			obj.files.push(article);
		});

		folder.wiki_file_items.forEach(function (value1, index1, array1) {
			// build files array
			var size = value1.wiki_files[value1.wiki_files.length - 1].size / 1024 / 1024;
			var mime = value1.wiki_files[value1.wiki_files.length - 1].mime;
			var type = get_mime_type(mime);
			var file = {
				name: value1.name,
				type: type,
				info: size.toFixed(2) + ' mb',
				url: value1.wiki_files[value1.wiki_files.length - 1].attachment,
				id: value1.id,
				details: value1.description
			}

			if (lang_code.get_locale() == 'en') {
				file.name = value1.name_en || value1.name;
			}

			obj.files.push(file);
		});

		obj.sub_folders = $filter('orderBy')(obj.sub_folders, 'name');
		// obj.files = $filter('orderBy')(obj.files, 'name');

		$scope.folder = obj;
		$scope.breadcrumb_active = obj.name;
	}

	if ($state.params.level > 1) {
		var back_arr = angular.copy($state.params.index_arr);
		back_arr.pop();
		$scope.back_params = {
			index_arr: back_arr,
			level: parseInt($state.params.level) - 1
		}
	};
});