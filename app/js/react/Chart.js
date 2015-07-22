import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.store = {};
    }

    componentDidMount() {
        var data = this.props.data;

        var pad = 70;
        var w = document.querySelector('#timeChartWrapper').clientWidth - pad;
        var h = 500;
        var d0 = data[0].day;
        var d1 = data[data.length - 1].day;
        var maxY = Math.max.apply(Math, data.map(
            function (o) {
                return o.item;
            }
        ));
        var minY = Math.min.apply(Math, data.map(
            function (o) {
                return o.item;
            }
        ));

        var x = d3.time.scale().domain([d0, d1]).range([0, w]);
        var y = d3.scale.linear().domain([minY, maxY]).rangeRound([h, 0]);

        var svg = d3.select('#timeChartWrapper')
            .append('svg:svg')
            .attr('height', h + pad)
            .attr('width', w + pad);

        var vis = svg.append('svg:g')
            .attr('transform', 'translate(50, 20)');

        var rules = vis.append('svg:g').classed('rules', true);

        function make_x_axis() {
            return d3.svg.axis()
                .scale(x)
                .orient('bottom')
                .ticks(30)
        }

        function make_y_axis() {
            return d3.svg.axis()
                .scale(y)
                .orient('left')
                .ticks(10)
        }

        rules.append('svg:g').classed('grid x_grid', true)
            .attr('transform', 'translate(0,' + h + ')')
            .call(make_x_axis()
                .tickSize(-h, 0, 0)
                .tickFormat('')
            );

        rules.append('svg:g').classed('grid y_grid', true)
            .call(make_y_axis()
                .tickSize(-w, 0, 0)
                .tickFormat('')
            );

        rules.append('svg:g').classed('labels x_labels', true)
            .attr('transform', 'translate(0,' + h + ')')
            .call(make_x_axis()
                .tickSize(5)
                .tickFormat(d3.time.format('%b %d')))
            .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");

        rules.append('svg:g').classed('labels y_labels', true)
            .call(make_y_axis()
                .tickSubdivide(1)
                .tickSize(10, 5, 0)
        );

        var lineGen = d3.svg.line()
                .x(function(d) {
                    return x(d.day);
                })
                .y(function(d) {
                    return y(d.item);
                }).interpolate('basis');

        rules.append('svg:path')
            .attr('d', lineGen(data))
            .attr('stroke', 'green')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }

    render() {
        return (
            <div id='timeChartWrapper' className='time-chart-wrapper' />
        )
    }
}
