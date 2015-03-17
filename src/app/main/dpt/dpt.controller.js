'use strict';

var DptCtrl = function($scope, $rootScope, $stateParams, leafletData, chartData, geojson, dptGeoJson, mapData) {
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }

    // Map
    $scope.mapData = mapData;
    $scope.geojson = geojson;
    for (var i = 0; i < dptGeoJson.features.length; ++i) {
        var feature = dptGeoJson.features[i];
        if (feature.properties.code == $scope.dpt.code) {
            feature = L.polygon(feature.geometry.coordinates[0]);
            var lonLat = feature.getBounds().getCenter();
            $scope.center = [lonLat.lng, lonLat.lat, ];
            leafletData.getMap().then(function(map) {
                $scope.center.push(map.getBoundsZoom(feature.getBounds()));
            });
            break;
        }
    }

    // Charts
    $scope.dataDpt = computeChartData(chartData.dpt);
    $scope.configDpt = {
        yLabel : "% de voix exprimées",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };
    $scope.titleDpt = "Résultats par parti - " + $scope.dpt.name + " - ";

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataDpt);
    $scope.configFE = {
        yLabel : "% de voix exprimées",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
    $scope.titleFE = "Résultats par parti - France - ";

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
        return $http.get("assets/json/geo/cantons.geojson").then(function(data) {
            var ret = [];
            var code_dep = $stateParams.dpt;
            for (var i = 0; i < data.data.features.length; ++i) {
                if (data.data.features[i].properties.code_dep === code_dep) {
                    ret.push(data.data.features[i]);
                }
            }
            data.data.features = ret;
            return data.data;
        });
    }],

    dptGeoJson : ['$http', function($http) {
        return $http.get("assets/json/geo/departements.geojson").then(function(data) {
            return data.data;
        });
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
    .controller('DptCtrl', ['$scope', '$rootScope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'dptGeoJson', 'mapData', DptCtrl]);