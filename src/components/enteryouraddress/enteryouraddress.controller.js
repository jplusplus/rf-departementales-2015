'use strict';

angular.module('departementales2015').controller('EnterYourAddressCtrl', ['$scope', '$http', '$state', 'Loader', function ($scope, $http, $state, Loader) {
    var geojson;
    var base_url = "http://nominatim.openstreetmap.org/search.php";

    $scope.error = undefined;

    $scope.onSubmit = function() {
        $scope.error = undefined;

        Loader.increment();

        $http.get(base_url, {
            params : {
                format : 'json',
                q : $scope.address
            }
        }).then(function(data) {
            Loader.decrement();
            if (data.status === 200 && data.data.length > 0) {
                var can = undefined;
                var latLng = L.latLng(data.data[0].lon, data.data[0].lat);

                // Find the right feature
                var containers = leafletPip.pointInLayer([latLng.lat, latLng.lng], L.geoJson(geojson), true);
                if (containers.length > 0) {
                    can = containers[0].feature;
                }

                if (can != null) {
                    $state.go('home.canton', {
                        dpt : can.properties.code_dep,
                        canton : can.properties.num_canton,
                        ll : latLng.lat + ";" + latLng.lng
                    });
                } else {
                    $scope.error = "Cette adresse n'est pas concernée par les élections.";
                }
            } else {
                $scope.error = "Adresse invalide."
            }
        });
    };

    // First we need to retrieve geojson
    $http.get("assets/json/geo/cantons.geojson").then(function(data) {
        geojson = data.data;
    });
}]);
