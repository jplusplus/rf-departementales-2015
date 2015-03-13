'use strict';

var getUpperLimit = function(data) {
    var max = parseInt(d3.max(data, function(d) { return d.value; }));
    while (max % 10) { ++max; }
    return max;
};

angular.module('departementales2015')
    .directive('hbarchart', ['$rootScope', function ($rootScope) {
        return {
            scope : {
                data : '=data'
            },

            link : function($scope, $element) {
                var margin = {
                    top : 10,
                    right : 150,
                    bottom : 60,
                    left : 0
                };

                var svg, width, height, x, y;

                width = $($element).width() - (margin.left + margin.right);
                height = $($element).height() - (margin.top + margin.bottom);


                // Bootstrap svg
                svg = d3.select($element[0]).append('svg')
                        .attr('width', width + (margin.left + margin.right))
                        .attr('height', height + (margin.top + margin.bottom))
                        .append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


                // Domains
                x = d3.scale.linear().range([0, width]);
                x.domain([0, getUpperLimit($scope.data)]);

                y = d3.scale.ordinal().rangeBands([0, height], .3);
                var bands = [];
                for (var i = 0; i < $scope.data.length; ++i) {
                    bands.push({ label : "Pre " + $scope.data[i].label });
                    bands.push({ label : $scope.data[i].label });
                }
                y.domain(bands.map(function(d) { return d.label; }));


                // Bars
                svg.selectAll(".bar").data($scope.data).enter().append("rect")
                   .attr("x", 0)
                   .attr("y", function(d) { return y(d.label); })
                   .attr("height", y.rangeBand())
                   .attr("width", function(d) { return x(d.value); })
                   .attr("class", function(d, i) { return "bar bar-" + String(i) + " " + d.color; });

                // Texts
                for (var i = 0; i < $scope.data.length; ++i) {
                    var d = $scope.data[i];

                    var text = svg.append("text");
                    text.attr("x", 0)
                        .attr("y", y("Pre " + d.label) + (y.rangeBand() / 2));

                    text.append("tspan").text(d.label);
                    text.append("tspan").text(d.nom).attr('dy', 20).attr('x', 0);

                    text = svg.append("text");
                    text.attr("x", width)
                        .attr("y", y(d.label));

                    text.append("tspan").text(d.value + "%");
                    text.append("tspan").text(d.nombre + " voies").attr('dy', 20).attr('x', width);
                }
            }
        };
    }]);