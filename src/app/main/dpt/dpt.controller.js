'use strict';

var DptCtrl = function($scope, chartData) {
    // Charts
    $scope.dataDpt = computeChartData(chartData);
    $scope.configDpt = {
        yLabel : "% de voix",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };

    $scope.dataFE = [];
    $scope.configFE = {
        yLabel : "% de voix",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
};

DptCtrl.resolve = {
    chartData : ['$http', '$stateParams', function($http, $stateParams) {
            return $http.get("/assets/json/results/T1/0" + $stateParams.dpt + ".json").then(function(data) {
                return data.data.results;
            });
        }],
};

angular.module('departementales2015')
    .controller('DptCtrl', ['$scope', 'chartData', DptCtrl]);