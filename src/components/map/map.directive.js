'use strict';

angular.module('departementales2015')
    .directive('map', ['$state', '$stateParams', 'leafletData', function ($state, $stateParams, leafletData) {
        return {
            restrict : 'EA',
            scope : {
                data : '=data',
                geo : '=geo',
                centerLonLat : "=centerLonLat"
            },
            templateUrl : 'components/map/map.html',
            compile : function() {
                return {
                    pre : function($scope) {
                        if ($scope.centerLonLat != null) {
                            $scope.center = {
                                lat: $scope.centerLonLat[0],
                                lng: $scope.centerLonLat[1],
                                zoom: $scope.centerLonLat[2] || 8
                            }
                        } else {
                            $scope.center = {
                                lat: 46,
                                lng: 3.5,
                                zoom: 5.2
                            };
                        }

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
                            colors : [],
                            labels : []
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
                            onEachFeature: (function() {
                                var addToLegend = function(color, label) {
                                    if (! _.contains($scope.legend.colors, color)) {
                                        var legend = _.cloneDeep($scope.legend);
                                        legend.colors.push(color);
                                        legend.labels.push(label);
                                        $scope.legend = legend;
                                    }
                                };

                                return function(feature, layer) {
                                    var color = "#fff";
                                    if (_.has($scope.data, feature.properties.code)) {
                                        var data = $scope.data[feature.properties.code];
                                        if (data != null) {
                                            color = getColorFromNuance(data[0]);
                                            addToLegend(color, getLabelFromNuance(data[0]));

                                            // Bind events
                                            layer.on('click', $scope.click);
                                            layer.on('mouseover', $scope.mouseenter);
                                            layer.on('mouseout', $scope.mouseout);
                                        } else {
                                            color = "#999";
                                            addToLegend(color, "");
                                        }
                                    } else {
                                        addToLegend("#fff", "N/A")
                                    }

                                    layer.setStyle({
                                        fillColor : color,
                                        fillOpacity : 1
                                    });
                                };
                            })()
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

                        $scope.$watch("centerLonLat", function(newValue, oldValue) {
                            if (newValue != null) {
                                $scope.center = {
                                    lat: $scope.centerLonLat[0],
                                    lng: $scope.centerLonLat[1],
                                    zoom: $scope.centerLonLat[2] || 8
                                };
                            }
                        }, true);
                    }
                }
            }
        }
    }]);
