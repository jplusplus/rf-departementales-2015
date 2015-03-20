'use strict';

var CantonCtrl = function($scope, $rootScope, $stateParams, leafletData, chartData, geojson, mapData, Loader) {
    Loader.increment();
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }
    $scope.canton = {
        code : $stateParams.canton,
        name : ""
    }
    $scope.lastUpdate = formatLastUpdate(chartData.dpt.lastUpdateDateTime);


    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;
    for (var i = 0; i < geojson.features.length; ++i) {
        var feature = L.polygon(geojson.features[i].geometry.coordinates[0]);
        if (geojson.features[i].properties.num_canton === parseInt($stateParams.canton)) {
            leafletData.getMap("m_mapcanton").then(function(map) {
                var bounds = feature.getBounds();
                if (bounds._northEast.lng - bounds._southWest.lng > 0.07 || ($scope.dpt.code == 13 && $scope.canton.code == 23)) {
                    bounds._northEast.lng += 0.7;
                    bounds._southWest.lng -= 0.7;
                }
                var zoom = map.getBoundsZoom(bounds);
                $scope.center = [bounds.getCenter().lng, bounds.getCenter().lat, zoom];
                Loader.decrement();
            });
            $scope.canton.name = geojson.features[i].properties.nom;

            $scope.titleCan = "Résultats par parti - ";
            $scope.titleFE = "Résultats par parti - ";
            if ($rootScope.getT() == 1) {
                $scope.titleCan += "1er tour";
                $scope.titleFE += "1er tour";
            } else {
                $scope.titleCan += "2nd tour";
                $scope.titleFE += "2nd tour";
            }

            break;
        }
    }

    // Charts
    $scope.dataCan = computeChartData(chartData.canton);
    $scope.configCan = {
        yLabel : "% de voix exprimées",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };

    $scope.dataCanH = _.remove(_.take(_.cloneDeep($scope.dataCan), 5), function(d) { return d.value > 0; });

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataCan);
    $scope.configFE = {
        yLabel : "% de voix exprimées",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }

    if ($stateParams.ll != null) {
        $scope.mapMarker = {
            lat : parseFloat($stateParams.ll.split(';')[1]),
            lng : parseFloat($stateParams.ll.split(';')[0])
        }
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
            }),
            dpt : $http.get('assets/json/results/T' + t + '/' + dpt + ".json").then(function(data) {
                return data.data;
            })
        });
    }],

    geojson : ['$http', '$stateParams', function($http, $stateParams) {
        if ([971, 974, 976].indexOf(parseInt($stateParams.dpt)) >= 0) {
            return $http.get('assets/json/geo/' + $stateParams.dpt + '.geojson').then(function(data) {
                data = data.data;
                for (var i = 0; i < data.features.length; ++i) {
                    data.features[i].properties.code_dep = $stateParams.dpt;
                    data.features[i].properties.num_canton = parseInt(data.features[i].properties.num_canton);
                }
                return data;
            });
        } else {
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
        }
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
    .controller('CantonCtrl', ['$scope', '$rootScope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'mapData', 'Loader', CantonCtrl]);