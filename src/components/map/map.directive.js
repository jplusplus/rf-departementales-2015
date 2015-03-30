'use strict';

angular.module('departementales2015')
    .directive('map', ['$state', '$stateParams', 'leafletData', '$rootScope', function ($state, $stateParams, leafletData, $rootScope) {
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
                        var t = $rootScope.getT();

                        var backupdata = undefined;
                        if (t === 2 && $scope.data instanceof Array) {
                            backupdata = $scope.data[1];
                            $scope.data = $scope.data[0];
                        }

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
                                zoom: $state.current.name === 'home.france' ? 5 : 8
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

                                            if( $state.current.name === 'home.france') {
                                              layer.bindLabel(feature.properties.nom);
                                              color = "#fff";
                                            } else {
                                              layer.bindLabel(feature.properties.nom + "<br />" + getLabelFromNuance(data[0]) + " : " + formatValue(data[1]) + "%");
                                              color = getColorFromNuance(data[0]);
                                              addToLegend(color, getLabelFromNuance(data[0]));
                                            }

                                            // Bind events
                                            layer.on('click', $scope.click);
                                        } else {
                                            color = "#999";
                                            addToLegend(color, "Non disponible");
                                        }
                                    } else if (backupdata != null) {
                                        if (_.has(backupdata, $scope.getCodeFromData(feature.properties))) {
                                            var data = backupdata[$scope.getCodeFromData(feature.properties)];
                                            if (data[1] > 50) {
                                                layer.bindLabel(feature.properties.nom + "<br />" + getLabelFromNuance(data[0]) + " : " + formatValue(data[1]) + "%");
                                            }

                                            // Bind events
                                            layer.on('click', $scope.click);
                                            addToLegend("#fff", "Parti élu au 1er tour");
                                        }
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

                        $scope.markers = { };
                        if ($scope.marker != null) {
                            $scope.markers.address = {
                                lat : $scope.marker.lat,
                                lng : $scope.marker.lng,
                                draggable : false,
                                focus : false,
                                class : "address"
                            }
                        }
                    },

                    post : function($scope, $element, $attrs) {
                        var mapId = $attrs.id != null ? 'm_' + $attrs.id : undefined;
                        leafletData.getMap(mapId).then(function(map) {
                            map.boxZoom.disable();

                            if (map.attributionControl != null) {
                                map.removeControl(map.attributionControl);
                                map.addControl(L.control.attribution({ position : "bottomleft" }));
                            }

                            if (!$state.is('home.france')) {
                                var pref = getPref($stateParams.dpt);
                                var marker = L.marker([pref.coord[0], pref.coord[1]], {
                                    draggable : false,
                                    focus : false,
                                    icon : L.icon({
                                        iconUrl : 'assets/map-marker.svg',
                                        iconSize : [26, 20],
                                        iconAnchor : [13, 10],
                                    }),
                                    clickable : false
                                });
                                marker.bindLabel(pref.name, {
                                    noHide : true,
                                    className : "pref-marker",
                                    offset : [-5 + ((pref.name.length / 2) * -6), -30]
                                });
                                marker.addTo(map);
                            }
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
