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
    chartData = _.sortBy(_.map(chartData, function(v, k) {
        return { color : k , value : v , label : getLabelFromNuance(k) };
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
    $scope.data = firstSeven;

    $scope.config1 = {
        yLabel : "% de voix",
        ns : "chart1"
    };
};

FranceCtrl.resolve = {
    chartData : function() {
        return {
            "BC-EXG" : 32,
            "BC-FG"  : 11,
            "BC-PG"  : 7,
            "BC-COM" : 0.6,
            "BC-SOC" : 24,
            "BC-UG"  : 2,
            "BC-RDG" : 2,
            "BC-DVG" : 1.3,
            "BC-VEC" : 1.7,
            "BC-DIV" : 0.9,
            "BC-MDM" : 0.5,
            "BC-UC"  : 16,
            "BC-UDI" : 3.8,
            "BC-UMP" : 7.8,
            "BC-UD"  : 4.1,
            "BC-DLF" : 3,
            "BC-DVD" : 2.2,
            "BC-FN"  : 2,
            "BC-EXD" : 1.5
        };
    },
    geojson : ['$http', function($http) {
        return $http.get("/assets/json/geo/departements.geojson").then(function(data) {
            return data.data;
        });
    }]
};

angular.module('departementales2015')
    .controller('FranceCtrl', ['$scope', 'chartData', 'geojson', FranceCtrl]);