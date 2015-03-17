'use strict';

angular.module('departementales2015')
    .directive('france', function ($timeout) {
      return {
        restrict : 'A',
        link: function(scope, el) {

          var resize = function() {
            var height = $(window).height()
            height -= $(el).offset().top
            height -= $(".enteryouraddress").height()
            $(el).css("min-height", height);
          };

          // Once when resizing the window
          $(window).on("resize", resize);
          // Once when after 1 second for render latency
          $timeout(resize, 1000);
          // Once now
          resize();
        }
      }
    });
