'use strict';

var getUpperLimit = function(data) {
    var max = d3.max(data, function(d) { return d.value; });
    while (max % 10) { ++max; }
    return max;
};

angular.module('departementales2015')
    .directive('barchart', function () {
        return {
            scope : {
                config : '=config',
                data : '=data'
            },

            link : function($scope, $element) {
                var margin = {
                    top : 40,
                    right : 30,
                    bottom : 40,
                    left : 30
                };
                var padding = 10;

                var svg, width, height, x, y, xAxis, yAxis;

                width = $($element).width() - (margin.left + margin.right);
                height = $($element).height() - (margin.top + margin.bottom);

                svg = d3.select($element[0]).append('svg')
                        .attr('width', width + (margin.left + margin.right))
                        .attr('height', height + (margin.top + margin.bottom))
                        .append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

                // Domains
                x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                x.domain($scope.data.map(function(d) { return d.label; }))

                y = d3.scale.linear().range([height, 0]);
                y.domain([0, getUpperLimit($scope.data)]);

                // Axis
                xAxis = d3.svg.axis().scale(x).orient("bottom");
                yAxis = d3.svg.axis().scale(y).orient("left").ticks(getUpperLimit($scope.data) / 10);

                svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0, " + height + ")")
                   .call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis);


                // Bars
                var barWidth = width / $scope.data.length - (padding * $scope.data.length);

                var bar = svg.selectAll(".bar").data($scope.data).enter().append("g")
                             .attr("transform", function(d, i) {
                                return "translate(" + (padding + (i * barWidth) + (padding * i)) + ", 0)";
                             });
                bar.append("rect")
                   .attr("y", function(d) { return y(d.value); })
                   .attr("height", function(d) { return height - y(d.value) - 1; })
                   .attr("width", barWidth - 1)
                   .attr("class", function(d) { return d.color; });
            }
        };
    });