'use strict';

angular.module('departementales2015')
    .controller('FranceCtrl', function ($scope) {
        $scope.data = [{
            label : "PS",
            value : 33
        }, {
            label : "UMP",
            value : 25
        }];

        $scope.config = {
        };
    });