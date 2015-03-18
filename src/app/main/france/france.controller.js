'use strict';

var FranceCtrl = function($scope, $rootScope, chartData, geojson, mapData) {
    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson.departements;

    $scope.geojson971 = geojson[971];
    $scope.center971 = [16.17, -61.52, 7];
    $scope.geojson974 = geojson[974];
    $scope.center974 = [-21.11, 55.53, 7];
    $scope.geojson976 = geojson[976];
    $scope.center976 = [-12.85, 45.16, 8];

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
    geojson : ['$q', '$http', function($q, $http) {
        return $q.all({
            departements : $http.get("assets/json/geo/departements.geojson").then(function(data) {
                return data.data;
            }),
            971 : $http.get("assets/json/geo/971_dpt.geojson").then(function(data) {
                return data.data;
            }),
            974 : $http.get("assets/json/geo/974_dpt.geojson").then(function(data) {
                return data.data;
            }),
            976 : $http.get("assets/json/geo/976_dpt.geojson").then(function(data) {
                return data.data;
            })
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