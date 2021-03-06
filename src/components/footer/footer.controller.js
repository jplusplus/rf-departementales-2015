'use strict';

angular.module('departementales2015')
    .controller('FooterCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.selectedT = $rootScope.getT();

        $scope.baseUrl = $location.absUrl().split('?')[0];

        $scope.getShareUrl = function() {
            return $scope.baseUrl + "?t=" + $scope.selectedT;
        };

        $scope.getIframeElement = function() {
            return '<iframe src="' + $location.absUrl() + '" width="100%" height="780" frameborder="0" allowfullscreen></iframe>';
        }

        $scope.$watch(function() { return $rootScope.getT(); }, function() {
            $scope.selectedT = $rootScope.getT();
        }, true);
    }]);
