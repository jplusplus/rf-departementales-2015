'use strict';

var CantonCtrl = function($scope, $stateParams, leafletData, chartData, geojson, mapData) {
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }
    $scope.canton = {
        code : $stateParams.canton,
        name : geojson.features[0].properties.nom
    }

    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;
    var feature = L.polygon(geojson.features[0].geometry.coordinates[0]);
    var lonLat = feature.getBounds().getCenter();
    $scope.center = [lonLat.lng, lonLat.lat, ];
    leafletData.getMap().then(function(map) {
        $scope.center.push(map.getBoundsZoom(feature.getBounds()));
    });

    // Charts
    // $scope.dataCan = computeChartData(chartData.canton);
    // $scope.configCan = {
    //     yLabel : "% de voix",
    //     ns : "chartDpt",
    //     linkedChartNs : "chartFE"
    // };

    // $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataCan);
    // $scope.configFE = {
    //     yLabel : "% de voix",
    //     ns : "chartFE",
    //     linkedChartNs : "chartDpt"
    // }
};

CantonCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', function($http, $stateParams, $q) {
        return $q.all({
            canton : $http.get('/assets/json/results/T1/0' + $stateParams.dpt + '/' + $stateParams.canton + ".json").then(function(data) {
                return data.data;
            }),
            FE : $http.get('/assets/json/results/T1/FE.json').then(function(data) {
                return data.data;
            })
        });
    }],

    geojson : ['$http', '$stateParams', function($http, $stateParams) {
        return $http.get('/assets/json/geo/cantons.geojson').then(function(data) {
            for (var i = 0; i < data.data.features.length; ++i) {
                var feature = data.data.features[i];
                if (feature.properties.code_dep === $stateParams.dpt && feature.properties.num_canton === parseInt($stateParams.canton)) {
                    data.data.features = [feature];
                    break;
                }
            }
            return data.data;
        });
    }],

    mapData : ['$http', '$stateParams', function($http, $stateParams) {
        return $http.get('/assets/json/results/T1/0' + $stateParams.dpt + '/MAP.json').then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('CantonCtrl', ['$scope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'mapData', CantonCtrl]);