'use strict';

var FranceCtrl = function($scope, $rootScope, chartData, geojson, mapData) {
    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson.departements;

    $scope.geojson971 = geojson[971];
    $scope.center971 = [16.27, -61.52, 9];
    $scope.geojson974 = geojson[974];
    $scope.center974 = [-21.21, 55.53, 9];
    $scope.geojson976 = geojson[976];
    $scope.center976 = [-12.85, 45.16, 10];

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
            971 : $http.get("assets/json/geo/971.geojson").then(function(data) {
                return data.data;
            }),
            974 : $http.get("assets/json/geo/974.geojson").then(function(data) {
                return data.data;
            }),
            976 : $http.get("assets/json/geo/976.geojson").then(function(data) {
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