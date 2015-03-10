'use strict';

angular.module('departementales2015')
    .directive('map', ['$state', function ($state) {
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
                        $scope.click = function(event) {
                            if ($state.is('home.france')) {
                                $state.go('home.dpt', { dpt : event.target.feature.properties.code });
                            }
                        };

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
                                var color = "#dedede";
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
                                    } else {
                                        color = "#fff";
                                    }
                                }

                                layer.setStyle({
                                    fillColor : color,
                                    fillOpacity : 1
                                });
                            }
                        };
                    },

                    post : function() { }
                }
            }
        }
    }]);
