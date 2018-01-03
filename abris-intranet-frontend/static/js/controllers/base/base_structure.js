angular.module('myApp').controller('BaseStructureCtrl',
function ($scope, $state, $http, $filter, jwtHelper, predicates, lang_code) {
	var token = localStorage.getItem('token');
	
	var main_categories = [];

	$http.get(api + 'pages/2/').then(function (resp) {
		$scope.base_text = resp["data"].text;
	}, function (resp) {
		console.log(resp);
	});

	fetch_wiki_items(JSON.parse(localStorage.wiki));

	function fetch_wiki_items (data) {
		data.forEach(function (value, index, array) {
			var obj = {
				name: value.name,
				folders: [],
				articles: [],
				files: [],
				showMore: false
			}

			if (lang_code.get_locale() == 'en') {
				obj.name = value.name_en || value.name;
			}

			value.children.forEach(function (value1, index1, array1) {
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

				var folder = {
					name: value1.name,
					info: folders_count + folders_predicate + ' ' + wiki_article_items_count + wiki_article_items_predicate,
					index_arr: [index, index1]
				}

				if (lang_code.get_locale() == 'en') {
					folder.name = value1.name_en || value1.name;
				}

				obj.folders.push(folder);
			}); // main_categories_children forEach

			value.wiki_article_items.forEach(function (value1, index1, array1) {
				// build articles array
				var article = {
					name: value1.name,
					id: value1.id,
					type: 'txt',
					info: '',
					url: ''
				}

				if (lang_code.get_locale() == 'en') {
					article.name = value1.name_en || value1.name;
				}

				// obj.articles.push(article);
				obj.files.push(article);
			});

			value.wiki_file_items.forEach(function (value1, index1, array1) {
				// build files array
				var size = value1.wiki_files[value1.wiki_files.length - 1].size / 1024 / 1024;
				var mime = value1.wiki_files[value1.wiki_files.length - 1].mime;
				var type = get_mime_type(mime);
				var file = {
					name: value1.name,
					type: type,
					info: size.toFixed(2) + ' mb',
					url: value1.wiki_files[value1.wiki_files.length - 1].attachment,
					id: value1.id
				}

				if (lang_code.get_locale() == 'en') {
					file.name = value1.name_en || value1.name;
				}

				obj.files.push(file);
			});

			obj.folders = $filter('orderBy')(obj.folders, 'name');
			// obj.articles = $filter('orderBy')(obj.articles, 'name');
			obj.files = $filter('orderBy')(obj.files, 'name');
			if (obj.folders.length + obj.files.length > 6) {
				obj.showMore = true;
			};

			main_categories.push(obj);
		}); // main_categories forEach

		$scope.main_categories = [];
		for (i = 0, j = 0; i < main_categories.length; i += 2, j++) {
			$scope.main_categories.push([main_categories[i]]);
			if (main_categories[i + 1]) {
				$scope.main_categories[j].push(main_categories[i + 1]);
			};
		}
	}
});