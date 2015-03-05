'use strict';

angular.module('departementales2015')
    .controller('FranceCtrl', function ($scope) {
        $scope.data = [{
            label : "PS",
            color : "BC-SOC",
            value : 33
        }, {
            label : "UMP",
            color : "BC-UMP",
            value : 25
        }];

        $scope.config = {
        };
    });