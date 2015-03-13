'use strict';

angular.module('departementales2015')
  .controller('NavbarCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.goToT = function(t) {
        if (t == 1 || t == 2) {
            $state.go('.', { t : t });
        }
    }
  }]);
