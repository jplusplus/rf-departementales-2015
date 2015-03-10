'use strict';

angular.module('departementales2015')
    .directive('map', ['$state', 'leafletData', function ($state, leafletData) {
        return {
            restrict : 'EA',
            scope : {
                data : '=data',
                geo : '=geo'
            },
            templateUrl : 'components/map/map.html',
            compile : function() {
                return {
                    pre : function($scope) {
                        $scope.center = {
                            lat: 46,
                            lng: 3.5,
                            zoom: 5.2
                        };

                        $scope.defaults = {
                            zoomControl : false,
                            keyboard : false,
                            dragging : false,
                            attributionControl : false,
                            scrollWheelZoom : false,
                            doubleClickZoom : false
                        };

                        $scope.legend = {
                            position : "bottomleft",
                            colors : ["#fff", "#dedede"],
                            labels : ["", ""]
                        };

                        $scope.events = {
                            map : {
                                enable : [ 'click' , 'mousemove' ],
                                logic : 'emit'
                            }
                        };

                        $scope.geojson = {
                            data : $scope.geo,
                            style : {
                                weight: 1,
                                color: "#000"
                            },
                            onEachFeature: function(feature, layer) {
                                var color = "#fff";
                                if (_.has($scope.data, feature.properties.code)) {
                                    var data = $scope.data[feature.properties.code];
                                    if (data != null) {
                                        color = getColorFromNuance(data[0]);
                                        if (! _.contains($scope.legend.colors, color)) {
                                            var legend = _.cloneDeep($scope.legend);
                                            legend.colors.push(color);
                                            legend.labels.push(getLabelFromNuance(data[0]));
                                            $scope.legend = legend;
                                        }

                                        // Bind events
                                        layer.on('click', $scope.click);
                                        layer.on('mouseover', $scope.mouseenter);
                                        layer.on('mouseout', $scope.mouseout);
                                    } else {
                                        color = "#999";
                                    }
                                }

                                layer.setStyle({
                                    fillColor : color,
                                    fillOpacity : 1
                                });
                            }
                        };
                    },

                    post : function($scope) {
                        leafletData.getMap().then(function(map) {
                            $scope.mouseenter = function(event) {
                                var feature = event.target.feature;
                                var data = $scope.data[feature.properties.code];
                                var popup = L.popup().setLatLng(event.target.getBounds().getCenter())
                                popup.options.closeButton = false;
                                popup.setContent(feature.properties.nom + "<br />" + getLabelFromNuance(data[0]) + " : " + data[1] + "%");
                                popup.openOn(map);
                            };

                            $scope.mouseout = function() {
                                map.closePopup();
                            };
                        });

                        $scope.click = function(event) {
                            if ($state.is('home.france')) {
                                $state.go('home.dpt', { dpt : event.target.feature.properties.code });
                            }
                        };
                    }
                }
            }
        }
    }]);
