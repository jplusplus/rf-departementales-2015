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

                var svg, width, height, x, y, xAxis, yAxis, svgYAxis, tt;

                width = $($element).width() - (margin.left + margin.right);
                height = $($element).height() - (margin.top + margin.bottom);


                // Bootstrap svg
                svg = d3.select($element[0]).append('svg')
                        .attr('width', width + (margin.left + margin.right))
                        .attr('height', height + (margin.top + margin.bottom))
                        .append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


                // Bootstrap tooltip
                tt = d3.select($element[0]).append('div').classed({
                    "chart__tooltip" : true,
                    "tooltip" : true
                });
                tt.append("div").attr("class", "tooltip-arrow");
                tt.append("div").attr("class", "tooltip-inner").text("test");


                // Domains
                x = d3.scale.ordinal().rangeBands([0, width], .2);
                x.domain($scope.data.map(function(d) { return d.label; }))

                y = d3.scale.linear().range([height, 0]);
                y.domain([0, getUpperLimit($scope.data)]);


                // Axis
                xAxis = d3.svg.axis().scale(x).orient("bottom");
                yAxis = d3.svg.axis().scale(y).orient("left").ticks(getUpperLimit($scope.data) / 10);

                svg.append("g").attr("class", "x axis")
                   .attr("transform", "translate(0, " + height + ")")
                   .call(xAxis);
                svgYAxis = svg.append("g").attr("class", "y axis").call(yAxis);
                if ($scope.config.yLabel != null) {
                    svgYAxis.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6).attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text($scope.config.yLabel);
                }


                // Rulers
                var rulers = svg.append("g").attr("class", "rulers");
                for (var i = 10; i <= getUpperLimit($scope.data); i += 10) {
                    rulers.append("line").attr("x1", 1).attr("y1", y(i))
                                         .attr("x2", width).attr("y2", y(i));
                }


                // Bars
                svg.selectAll(".bar").data($scope.data).enter().append("rect")
                   .attr("x", function(d) { return x(d.label); })
                   .attr("y", function(d) { return y(d.value); })
                   .attr("height", function(d) { return height - y(d.value) - 1; })
                   .attr("width", x.rangeBand())
                   .attr("class", function(d) { return "bar " + d.color; })
                   .on("mouseenter", function(d, i) {
                        var d3This = d3.select(this);
                        if (i === 0) {
                            tt.classed({ left : false , right : true });
                            tt.style("left", (margin.left + parseFloat(d3This.attr("x")) + parseFloat(d3This.attr("width"))) + "px")
                        } else {
                            tt.classed({ left : true , right : false });
                            tt.style("left", (margin.left + parseFloat(d3This.attr("x")) - ($(tt[0]).width() + 10)) + "px")
                        }

                        tt.style({
                            top: (margin.top + parseFloat(d3This.attr('y')) - ($(tt[0]).height() / 2)) + "px",
                            opacity : 1
                        });

                        if (d.tooltip != null) {
                            tt.select(".tooltip-inner").text(d.tooltip);
                        } else {
                            tt.select(".tooltip-inner").text(d.value + "%");
                        }
                   })
                   .on("mouseout", function() {
                        tt.style("opacity", 0);
                   });
            }
        };
    });