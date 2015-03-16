'use strict';

angular.module('departementales2015').controller('EnterYourAddressCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var geojson;
    var base_url = "http://nominatim.openstreetmap.org/search.php";

    $scope.onSubmit = function() {
        $http.get(base_url, {
            params : {
                format : 'json',
                q : $scope.address
            }
        }).then(function(data) {
            if (data.status === 200 && data.data.length > 0) {
                var can = undefined;
                var latLng = L.latLng(data.data[0].lon, data.data[0].lat);

                // We need to iterate over geojson features to find the right one
                for (var i = 0; i < geojson.features.length; ++i) {
                    var feature = geojson.features[i];
                    var latLngBounds = L.polygon(feature.geometry.coordinates[0]).getBounds();
                    if (latLngBounds.contains(latLng)) {
                        can = feature;
                    }
                }

                if (can != null) {
                    $state.go('home.canton', {
                        dpt : can.properties.code_dep,
                        canton : can.properties.num_canton,
                        ll : latLng.lat + ";" + latLng.lng
                    });
                }
            }
        });
    };

    // First we need to retrieve geojson
    $http.get("assets/json/geo/cantons.geojson").then(function(data) {
        geojson = data.data;
    });
}]);
