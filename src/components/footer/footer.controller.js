'use strict';

angular.module('departementales2015')
    .controller('FooterCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.selectedT = $rootScope.getT();

        $scope.baseUrl = $location.absUrl().split('?')[0];

        $scope.getShareUrl = function() {
            return $scope.baseUrl + "?t=" + $scope.selectedT;
        };

        $scope.getIframeElement = function() {
            return '<iframe src="' + $scope.baseUrl + '" width="636" height="780"></iframe>';
        }

        $scope.$watch(function() { return $rootScope.getT(); }, function() {
            $scope.selectedT = $rootScope.getT();
        }, true);
    }]);
