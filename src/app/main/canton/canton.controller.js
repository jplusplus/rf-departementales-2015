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
    for (var i = 0; i < geojson.features.length; ++i) {
        var feature = L.polygon(geojson.features[i].geometry.coordinates[0]);
        if (geojson.features[i].properties.num_canton === parseInt($stateParams.canton)) {
            var lonLat = feature.getBounds().getCenter();
            $scope.center = [lonLat.lng, lonLat.lat, ];
            leafletData.getMap().then(function(map) {
                $scope.center.push(map.getBoundsZoom(feature.getBounds()));
            });
            break;
        }
    }

    // Charts
    $scope.dataCan = computeChartData(chartData.canton);
    $scope.configCan = {
        yLabel : "% de voix",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };

    // $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataCan);
    // $scope.configFE = {
    //     yLabel : "% de voix",
    //     ns : "chartFE",
    //     linkedChartNs : "chartDpt"
    // }
};

CantonCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', function($http, $stateParams, $q) {
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        var canton = $stateParams.canton.length > 1 ? $stateParams.canton : '0' + $stateParams.canton;
        return $q.all({
            canton : $http.get('assets/json/results/T1/' + dpt + '/' + canton + ".json").then(function(data) {
                return data.data;
            }),
            FE : $http.get('assets/json/results/T1/FE.json').then(function(data) {
                return data.data;
            })
        });
    }],

    geojson : ['$http', '$stateParams', function($http, $stateParams) {
        return $http.get('assets/json/geo/cantons.geojson').then(function(data) {
            var features = [];
            for (var i = 0; i < data.data.features.length; ++i) {
                var feature = data.data.features[i];
                if (feature.properties.code_dep === $stateParams.dpt) {
                    features.push(feature);
                }
            }
            data.data.features = features;
            return data.data;
        });
    }],

    mapData : ['$http', '$stateParams', function($http, $stateParams) {
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        return $http.get('assets/json/results/T1/' + dpt + '/MAP.json').then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('CantonCtrl', ['$scope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'mapData', CantonCtrl]);