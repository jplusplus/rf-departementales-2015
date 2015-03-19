'use strict';

var DptCtrl = function($scope, $rootScope, $stateParams, leafletData, chartData, geojson, mapData, Loader) {
    Loader.increment();
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }

    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;
    leafletData.getMap("m_mapdpt").then(function(map) {
        var bounds = L.polygon(geojson.features[0].geometry.coordinates[0]).getBounds();
        for (var i = 1; i < geojson.features.length; ++i) {
            var tmpBounds = L.polygon(geojson.features[i].geometry.coordinates[0]).getBounds();
            if (tmpBounds._northEast.lat > bounds._northEast.lat) {
                bounds._northEast.lat = tmpBounds._northEast.lat;
            }
            if (tmpBounds._northEast.lng > bounds._northEast.lng) {
                bounds._northEast.lng = tmpBounds._northEast.lng;
            }
            if (tmpBounds._southWest.lat < bounds._southWest.lat) {
                bounds._southWest.lat = tmpBounds._southWest.lat;
            }
            if (tmpBounds._southWest.lng < bounds._southWest.lng) {
                bounds._southWest.lng = tmpBounds._southWest.lng;
            }
        }

        var center = bounds.getCenter();
        $scope.center = [center.lng, center.lat, map.getBoundsZoom(bounds)];
        Loader.decrement();
    });

    // Charts
    $scope.dataDpt = computeChartData(chartData.dpt);
    $scope.configDpt = {
        yLabel : "% de voix exprimées",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };
    $scope.titleDpt = "Résultats par parti - ";

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataDpt);
    $scope.configFE = {
        yLabel : "% de voix exprimées",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
    $scope.titleFE = "Résultats par parti - ";

    if ($rootScope.getT() == 1) {
        $scope.titleDpt += "1er tour";
        $scope.titleFE += "1er tour";
    } else {
        $scope.titleDpt += "2nd tour";
        $scope.titleFE += "2nd tour";
    }
};

DptCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', '$rootScope', function($http, $stateParams, $q, $rootScope) {
        var t = $rootScope.getT();
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        return $q.all({
            dpt : $http.get("assets/json/results/T" + t + "/" + dpt + ".json").then(function(data) {
                return data.data.results;
            }),
            FE : $http.get("assets/json/results/T" + t + "/FE.json").then(function(data) {
                return data.data;
            })
        });
    }],

    geojson : ['$http', '$stateParams', function($http, $stateParams) {
        var code_dep = $stateParams.dpt;

        if ([971, 974, 976].indexOf(parseInt(code_dep)) >= 0) {
            return $http.get("assets/json/geo/" + code_dep + ".geojson").then(function(data) {
                return data.data;
            });
        } else {
            return $http.get("assets/json/geo/cantons.geojson").then(function(data) {
                var ret = [];
                for (var i = 0; i < data.data.features.length; ++i) {
                    if (data.data.features[i].properties.code_dep === code_dep) {
                        ret.push(data.data.features[i]);
                    }
                }
                data.data.features = ret;
                return data.data;
            });
        }
    }],

    mapData : ['$http', '$stateParams', '$rootScope', function($http, $stateParams, $rootScope) {
        var t = $rootScope.getT();
        var dpt = $stateParams.dpt.length > 2 ? $stateParams.dpt : '0' + $stateParams.dpt;
        return $http.get("assets/json/results/T" + t + "/" + dpt + "/MAP.json").then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('DptCtrl', ['$scope', '$rootScope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'mapData', 'Loader', DptCtrl]);