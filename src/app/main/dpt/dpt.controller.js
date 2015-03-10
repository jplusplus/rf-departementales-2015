'use strict';

var DptCtrl = function($scope, $stateParams, leafletData, chartData, geojson, dptGeoJson) {
    //
    $scope.dpt = {
        code : $stateParams.dpt,
        name : getDptNameFromDptCode($stateParams.dpt)
    }

    // Map
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
        yLabel : "% de voix",
        ns : "chartDpt",
        linkedChartNs : "chartFE"
    };

    $scope.dataFE = computeChartDataAs(chartData.FE, $scope.dataDpt);
    $scope.configFE = {
        yLabel : "% de voix",
        ns : "chartFE",
        linkedChartNs : "chartDpt"
    }
};

DptCtrl.resolve = {
    chartData : ['$http', '$stateParams', '$q', function($http, $stateParams, $q) {
        return $q.all({
            dpt : $http.get("/assets/json/results/T1/0" + $stateParams.dpt + ".json").then(function(data) {
                return data.data.results;
            }),
            FE : $http.get("/assets/json/results/T1/FE.json").then(function(data) {
                return data.data;
            })
        });
    }],

    geojson : ['$http', '$stateParams', function($http, $stateParams) {
        return $http.get("/assets/json/geo/cantons.geojson").then(function(data) {
            var ret = [];
            var code_dep = $stateParams.dpt;
            for (var i = 0; i < data.data.features.length; ++i) {
                if (data.data.features[i].properties.code_dep === code_dep) {
                    ret.push(data.data.features[i]);
                }
            }
            data.data.features = ret;
            return data.data;
        })
    }],

    dptGeoJson : ['$http', function($http) {
        return $http.get("/assets/json/geo/departements.geojson").then(function(data) {
            return data.data;
        })
    }],
};

angular.module('departementales2015')
    .controller('DptCtrl', ['$scope', '$stateParams', 'leafletData', 'chartData', 'geojson', 'dptGeoJson', DptCtrl]);