'use strict';

var CantonCtrl = function($scope, $stateParams, leafletData, chartData, geojson, mapData) {
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }
    $scope.canton = {
        code : $stateParams.canton,
        name : ""
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
            $scope.canton.name = geojson.features[i].properties.nom;
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

    $scope.dataCanH = _.remove(_.take(_.cloneDeep($scope.dataCan), 5), function(d) { return d.value > 0; });

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataCan);
    $scope.configFE = {
        yLabel : "% de voix",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
};

CantonCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', '$rootScope', function($http, $stateParams, $q, $rootScope) {
        var t = $rootScope.getT();
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        var canton = $stateParams.canton.length > 1 ? $stateParams.canton : '0' + $stateParams.canton;
        return $q.all({
            canton : $http.get('assets/json/results/T' + t + '/' + dpt + '/' + canton + ".json").then(function(data) {
                return data.data;
            }),
            FE : $http.get('assets/json/results/T' + t + '/FE.json').then(function(data) {
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

    mapData : ['$http', '$stateParams', '$rootScope', function($http, $stateParams, $rootScope) {
        var t = $rootScope.getT();
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        return $http.get('assets/json/results/T' + t + '/' + dpt + '/MAP.json').then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('CantonCtrl', ['$scope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'mapData', CantonCtrl]);