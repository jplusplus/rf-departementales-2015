'use strict';

var DptCtrl = function($scope, $stateParams, chartData) {
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }

    // Charts
    $scope.dataDpt = computeChartData(chartData.dpt);
    $scope.configDpt = {
        yLabel : "% de voix",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataDpt);
    $scope.configFE = {
        yLabel : "% de voix",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
};

DptCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', function($http, $stateParams, $q) {
            return $q.all({
                dpt : $http.get("/assets/json/results/T1/0" + $stateParams.dpt + ".json").then(function(data) {
                    return data.data.results;
                }),
                FE : $http.get("/assets/json/results/T1/FE.json").then(function(data) {
                    return data.data;
                })
            });
        }],
};

angular.module('departementales2015')
    .controller('DptCtrl', ['$scope', '$stateParams', 'chartData', DptCtrl]);