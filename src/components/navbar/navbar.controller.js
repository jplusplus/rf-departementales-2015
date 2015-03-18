'use strict';

angular.module('departementales2015')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
    $scope.getT = function() {
        return $rootScope.getT();
    };

    $scope.goToT = function(t) {
        if (t == 1 || t == 2) {
            $scope.t = t;
            $state.go('.', { t : t });
        }
    }
  }]);
