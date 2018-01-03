angular.module('myApp').controller('BaseCtrl',
function ($scope, $state, $http, jwtHelper, wiki) {
	var token = localStorage.getItem('token');
	
	$scope.breadcrumb_active = "База знаний";
	$scope.breadcrumb = {
		'main.home': 'Главная'
	};

	if (wiki != null) {
		localStorage.wiki = JSON.stringify(wiki);
	}
});

/*
.zip - архивы
.txt - текстовый
.avi - видос
.mp3 - аудио
.exel - exel документ
.web - веб страница, html
.ppt - презентации ппт
.file - любой файл, нейтрайльный
.pdf - пдф
.doc - ворд
.font - шрифт
.img - картинка
*/

function get_mime_type (mime) {
	var img = new RegExp('image', 'g', 'i');
	if (mime.search(img) != -1) {
		return 'img';
	};

	var web = new RegExp('html|web', 'g', 'i');
	if (mime.search(web) != -1) {
		return 'web';
	};

	var txt = new RegExp('epub|text', 'g', 'i');
	if (mime.search(txt) != -1) {
		return 'txt';
	};
	
	var zip = new RegExp('zip', 'g', 'i');
	if (mime.search(zip) != -1) {
		return 'zip';
	};

	var avi = new RegExp('video', 'g', 'i');
	if (mime.search(avi) != -1) {
		return 'avi';
	};

	var mp3 = new RegExp('audio', 'g', 'i');
	if (mime.search(mp3) != -1) {
		return 'mp3';
	};

	var pdf = new RegExp('pdf', 'g', 'i');
	if (mime.search(pdf) != -1) {
		return 'pdf';
	};

	var doc = new RegExp('msword', 'g', 'i');
	if (mime.search(doc) != -1) {
		return 'doc';
	};

	var exel = new RegExp('excel', 'g', 'i');
	if (mime.search(exel) != -1) {
		return 'exel';
	};

	var ppt = new RegExp('powerpoint', 'g', 'i');
	if (mime.search(ppt) != -1) {
		return 'ppt';
	};

	var font = new RegExp('font', 'g', 'i');
	if (mime.search(font) != -1) {
		return 'font';
	};

	return 'file';
}