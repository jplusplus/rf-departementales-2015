'use strict';

var FranceCtrl = function($scope, $rootScope, chartData, geojson, mapData) {
    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;

    // Chart
    $scope.data = computeChartData(chartData);
    $scope.config = {
        yLabel : "% de voix exprimées",
        ns : "chart1"
    };
    $scope.chartTitle = "Résultats par parti - France - ";
    if ($rootScope.getT() == 1) {
        $scope.chartTitle += "1er tour";
    } else {
        $scope.chartTitle += "2nd tour";
    }
};

FranceCtrl.resolve = {
    chartData : ['$http', '$rootScope', function($http, $rootScope) {
        var t = $rootScope.getT();
        return $http.get("assets/json/results/T" + t + "/FE.json").then(function(data) {
            return data.data;
        });
    }],
    geojson : ['$http', function($http) {
        return $http.get("assets/json/geo/departements.geojson").then(function(data) {
            return data.data;
        });
    }],
    mapData : ['$http', '$rootScope', function($http, $rootScope) {
        var t = $rootScope.getT();
        return $http.get("assets/json/results/T" + t + "/FEMAP.json").then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('FranceCtrl', ['$scope', '$rootScope', 'chartData', 'geojson', 'mapData', FranceCtrl]);