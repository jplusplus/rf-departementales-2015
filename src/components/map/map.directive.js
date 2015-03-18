'use strict';

angular.module('departementales2015')
    .directive('map', ['$state', '$stateParams', 'leafletData', function ($state, $stateParams, leafletData) {
        return {
            restrict : 'EA',
            scope : {
                data : '=data',
                geo : '=geo',
                centerLonLat : "=centerLonLat",
                marker : '=marker',
                hasLegend : '=hasLegend'
            },
            templateUrl : 'components/map/map.html',
            compile : function() {
                return {
                    pre : function($scope, $element, $attrs) {
                        if ($attrs.id != null) {
                            $scope.mapid = 'm_' + $attrs.id;
                        }

                        $scope.getCodeFromData = function(data) {
                            if ($state.is('home.france')) {
                                return data.code;
                            } else {
                                var code = String(data.num_canton);
                                if (code.length < 2) { code = '0' + code; }
                                return code;
                            }
                        }

                        if ($scope.centerLonLat != null) {
                            $scope.center = {
                                lat: $scope.centerLonLat[0],
                                lng: $scope.centerLonLat[1],
                                zoom: $scope.centerLonLat[2] || 8
                            }
                        } else {
                            $scope.center = {
                                lat: 46.5,
                                lng: 3.5,
                                zoom: 5
                            };
                        }

                        $scope.defaults = {
                            zoomControl : false,
                            keyboard : false,
                            dragging : false,
                            attributionControl : ($scope.hasLegend == null || $scope.hasLegend === true),
                            scrollWheelZoom : false,
                            doubleClickZoom : false
                        };

                        $scope.tiles = {
                            url : 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
                            type: 'sxyz',
                            options : {
                                opacity : 1,
                                detectRetina : true,
                                reuseTiles : true,
                                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                            }
                        };

                        if ($scope.hasLegend == null || $scope.hasLegend === true) {
                            $scope.legend = {
                                position : "bottomleft",
                                colors : [],
                                labels : []
                            };
                        } else {
                            $scope.legend = false;
                        }

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
                                    if ($scope.legend && ! _.contains($scope.legend.colors, color)) {
                                        var legend = _.cloneDeep($scope.legend);
                                        legend.colors.push(color);
                                        legend.labels.push(label);
                                        $scope.legend = legend;
                                    }
                                };

                                return function(feature, layer) {
                                    var color = "#fff";
                                    if (_.has($scope.data, $scope.getCodeFromData(feature.properties))) {
                                        var data = $scope.data[$scope.getCodeFromData(feature.properties)];
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
                                        fillOpacity : 0.8
                                    });

                                    if ($state.is("home.canton")
                                     && parseInt($stateParams.canton) == parseInt($scope.getCodeFromData(feature.properties))) {
                                        layer.setStyle({
                                            weight : 2,
                                            opacity: 1
                                        });
                                    }
                                };
                            })()
                        };

                        var markerIcon = {
                            iconUrl : 'assets/map-marker.svg',
                            iconSize : [26, 20],
                            iconAnchor : [13, 10]
                        };
                        $scope.markers = { };
                        if (!$state.is('home.france')) {
                            var pref = getPref($stateParams.dpt);
                            $scope.markers = {
                                pref : {
                                    lat : pref.coord[0],
                                    lng : pref.coord[1],
                                    message : pref.name,
                                    draggable : false,
                                    focus : false,
                                    icon : markerIcon
                                }
                            };

                            if ($scope.marker != null) {
                                $scope.markers.address = {
                                    lat : $scope.marker.lat,
                                    lng : $scope.marker.lng,
                                    draggable : false,
                                    focus : false,
                                }
                            }
                        }
                    },

                    post : function($scope, $element, $attrs) {
                        var mapId = $attrs.id != null ? 'm_' + $attrs.id : undefined;
                        leafletData.getMap(mapId).then(function(map) {
                            $scope.mouseenter = function(event) {
                                var feature = event.target.feature;
                                var data = $scope.data[$scope.getCodeFromData(feature.properties)];
                                var popup = L.popup().setLatLng(event.target.getBounds().getCenter())
                                popup.options.closeButton = false;
                                popup.options.autoPan = false;
                                popup.setContent(feature.properties.nom + "<br />" + getLabelFromNuance(data[0]) + " : " + formatValue(data[1]) + "%");
                                popup.openOn(map);
                            };

                            $scope.mouseout = function() {
                                map.closePopup();
                            };
                        });

                        $scope.click = function(event) {
                            if ($state.is('home.france')) {
                                $state.go('home.dpt', { dpt : event.target.feature.properties.code });
                            } else {
                                $state.go('home.canton', { dpt : $stateParams.dpt , canton : event.target.feature.properties.num_canton });
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
