'use strict';

var FranceCtrl = function($scope, chartData, geojson) {
    // Map
    $scope.map = {
        center : {
            lat: 46,
            lng: 3.5,
            zoom: 5.2
        },
        geojson : {
            data : geojson,
            style : {
                weight: 1,
                color: "#000",
                fillColor: "green"
            },
            onEachFeature: function(feature, layer) {
                layer.setStyle({
                    fillColor : "yellow"
                })
            }
        },
        defaults : {
            zoomControl : false,
            keyboard : false,
            dragging : false,
            attributionControl : false,
            scrollWheelZoom : false,
            doubleClickZoom : false
        }
    };

    // Chart
    var lastColumnData = _.omit(chartData, function(v, k) { return k.indexOf("BC") === 0; });
    chartData = _.pick(chartData, function(v, k) { return k.indexOf("BC") === 0; });

    chartData = _.sortBy(_.map(chartData, function(v, k) {
        return { color : k , value : v.rapportExprime , label : getLabelFromNuance(k) };
    }), 'value').reverse();

    var firstSeven = _.slice(_.cloneDeep(chartData), 0, 7);
    var other = _.map(_.sortBy(_.slice(chartData, firstSeven.length), 'value'), function(v) {
        v.tooltip = v.label + " : " + String(v.value) + "%";
        v.label = "Autres";
        return v;
    });
    var otherSummedValue = _.reduce(other, function(a, b) { return a + b.value; }, 0);
    other = _.map(other, function(v, i) {
        var tmp = v.value;
        v.value = otherSummedValue;
        otherSummedValue -= tmp;
        return v;
    });

    firstSeven = firstSeven.concat(other);
    firstSeven.push({ value : 0 , label : "" });
    firstSeven.push({
        label : "ABS",
        value : lastColumnData.nuls.rapportInscrit + lastColumnData.blancs.rapportInscrit + lastColumnData.abstentions.rapportInscrit,
        tooltip : "Blancs et nuls : " + String(lastColumnData.nuls.rapportInscrit + lastColumnData.blancs.rapportInscrit) + "%",
        color : "BLANCSNULS"
    });
    firstSeven.push({
        label : "ABS",
        value : lastColumnData.abstentions.rapportInscrit,
        color : "ABS",
        tooltip : "Abstentions : " + String(lastColumnData.abstentions.rapportInscrit) + "%"
    });
    $scope.data = firstSeven;

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
    }]
};

angular.module('departementales2015')
    .controller('FranceCtrl', ['$scope', 'chartData', 'geojson', FranceCtrl]);