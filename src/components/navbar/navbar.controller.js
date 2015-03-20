'use strict';

angular.module('departementales2015')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', function ($scope, $rootScope, $state, $stateParams, $http) {
    $scope.isT2 = false;

    var checkIfT2 = function() {
        $scope.isT2 = false;

        var urlToCheck = "assets/json/results/T2/";

        if ($state.is('home.france')) {
            urlToCheck += "FE_exists.json";
        } else if ($state.is('home.dpt')) {
            var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
            urlToCheck += dpt + "_exists.json"
        } else if ($state.is('home.canton')) {
            var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
            var canton = $stateParams.canton.length > 1 ? $stateParams.canton : '0' + $stateParams.canton;
            urlToCheck += dpt + "/" + canton + "_exists.json";
        }

        $http.get(urlToCheck).then(function() {
            $scope.isT2 = true;
        }, function() {
            $scope.isT2 = false;
        });
    };

    $scope.getT = function() {
        return $rootScope.getT();
    };

    $scope.goToT = function(t) {
        if (t == 2 && !$scope.isT2) { return; }
        if (t == 1 || t == 2) {
            $scope.t = t;
            $state.go('.', { t : t });
        }
    }

    $scope.$on('$stateChangeSuccess', function() {
        checkIfT2();
    });

    checkIfT2();
  }]);
