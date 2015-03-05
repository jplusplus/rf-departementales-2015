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
        }, {
            label : "EELV",
            color : "BC-VEC",
            value : 50
        }, {
            label : "MODEM",
            color : "BC-MDM",
            value : 33
        }, {
            label : "MODEM",
            color : "BC-DLF",
            value : 26
        }];

        $scope.config = {
            yLabel : "% de voix"
        };
    });