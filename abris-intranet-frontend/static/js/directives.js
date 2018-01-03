myApp.directive('myEventsCalendar', function (lang_code, calendar_events, $http) {
	var config = {
		restrict: 'E',
		template: "<div id='calendar'></div>",
		link: function(scope, elm, attrs, ctrl) {
			wrapperScript();
			eventsCalendarScript(lang_code.get_locale(), calendar_events.list, $http, 'calendar');
		}
	}

	return config;
});

myApp.directive('myAside', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/widgets/widgets.html'
	}

	return config;
});

myApp.directive('myHeader', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/header.html'
	}

	return config;
});

myApp.directive('myBreadcrumb', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/breadcrumb.html'
	}

	return config;
});

myApp.directive('myMenuPanel', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/menu_panel.html'
	}

	return config;
});

myApp.directive('myHomeNav', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/home/home_nav.html'
	}

	return config;
});

myApp.directive('myBaseNav', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/base/base_nav.html'
	}

	return config;
});

myApp.directive('myMainContent', function () {
	var config = {
		restrict: 'E',
		templateUrl: function (elem, attr) {
			return 'static/views/' + attr.page + '.html';
		},
		link: function(scope, elm, attrs, ctrl) {
			wrapperScript();
		}
	}

	return config;
});

myApp.directive('myCompanyStructure', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/company/company_structure.html',
		link: function(scope, elm, attrs, ctrl) {
			companyStructureScript();
			wrapperScript();
		}
	}

	return config;
});

myApp.directive('myCompanyDetail', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/company/company_detail.html',
		link: function(scope, elm, attrs, ctrl) {
			companyDetailScript();
			wrapperScript();
		}
	}

	return config;
});

myApp.directive('myProfileEdit', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/users/edit_profile.html',
		link: function(scope, elm, attrs, ctrl) {
			profileEditScript();
			wrapperScript();
		}
	}

	return config;
});

myApp.directive('myGoogleMap', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/company/google_map.html',
		link: function(scope, elm, attrs, ctrl) {
			wrapperScript();
		}
	}

	return config;
});

myApp.directive('myBaseElem', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/base/base_element.html',
		link: function(scope, elm, attrs, ctrl) {
			wrapperScript();
			scope.kind	= attrs.kind;
			scope.title	= attrs.title;
			scope.info	= attrs.info;
			scope.details = attrs.details;
			if (attrs.folderName != undefined) {
				scope.folder_name = attrs.folderName;
			} else {
				scope.folder_name = '';
			}
			if (attrs.download != "" && attrs.download != undefined) {
				scope.download = attrs.download;
			};
			if (attrs.article != "" && attrs.article != undefined) {
				scope.articleId = attrs.article;
			};
			if (attrs.kind == 'folder') {
				scope.isFolder = true;
			} else {
				scope.isFolder = false;
			}
		}
	}

	return config;
});

myApp.directive('eatClickIf', ['$parse', '$rootScope',
  function($parse, $rootScope) {
    return {
      // this ensure eatClickIf be compiled before ngClick
      priority: 100,
      restrict: 'A',
      compile: function($element, attr) {
        var fn = $parse(attr.eatClickIf);
        return {
          pre: function link(scope, element) {
            var eventName = 'click';
            element.on(eventName, function(event) {
              var callback = function() {
                if (fn(scope, {$event: event})) {
                  // prevents ng-click to be executed
                  event.stopImmediatePropagation();
                  // prevents href 
                  event.preventDefault();
                  return false;
                }
              };
              if ($rootScope.$$phase) {
                scope.$evalAsync(callback);
              } else {
                scope.$apply(callback);
              }
            });
          },
          post: function() {}
        }
      }
    }
  }
]);

function company_slider_script () {
	$(document).ready(function(){
	  $('.bxslider').bxSlider({
	    slideWidth: 200,
	    minSlides: 2,
	    maxSlides: 4,
	    slideMargin: 0,
    	moveSlides: 1,
    	pager: false,
    	infiniteLoop: false,
    	hideControlOnEnd: true
	  });
	  $('.bxslider li img').bind('click', function(){
	  	$('.overlay').show();
	  });
	  $('.popup .close').bind('click', function(){
	  	$('.overlay').hide();
	  });
	  $('.overlay').hide();
	});
}

myApp.directive('mySliders', function () {
	var config = {
		restrict: 'E',
		templateUrl: 'static/views/company/sliders.html',
		link: function(scope, elm, attrs, ctrl) {
			company_slider_script();
		}
	}

	return config;
});

myApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                	scope.$emit(attr.onFinishRender);
                    // scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});