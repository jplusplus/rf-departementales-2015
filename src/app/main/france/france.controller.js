'use strict';

var FranceCtrl = function($scope, chartData, geojson, mapData) {
    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;

    // Chart
    $scope.data = computeChartData(chartData);

    $scope.config1 = {
        yLabel : "% de voix",
        ns : "chart1"
    };
};

FranceCtrl.resolve = {
    chartData : ['$http', function($http) {
            return $http.get("/assets/json/results/T1/FE.json").then(function(data) {
                return data.data;
            });
        }],
    geojson : ['$http', function($http) {
        return $http.get("/assets/json/geo/departements.geojson").then(function(data) {
            return data.data;
        });
    }],
    mapData : ['$http', function($http) {
        return $http.get("/assets/json/results/T1/FEMAP.json").then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('FranceCtrl', ['$scope', 'chartData', 'geojson', 'mapData', FranceCtrl]);