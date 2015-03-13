'use strict';

angular.module('departementales2015')
  .controller('NavbarCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.goToT = function(t) {
        if (t == 1 || t == 2) {
            $location.search({ t : t });
        }
    }
  }]);
