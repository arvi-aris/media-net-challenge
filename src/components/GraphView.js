import React, { Component } from 'react';
var BarChart = require('react-d3-basic').BarChart;

class GraphView extends Component{
    constructor(props){ 
        super(props);
    }
    render(){
        var width = 700,
        height = 500,
        title = "Graph view",
        chartSeries = [
        {
            field: 'price',
            name: 'Price',
        }
        ],
        x = function(d) {
        return d.ticker;
        },
        xScale = 'ordinal',
        xLabel = "Ticker",
        yLabel = "Price",
        yTicks = [20];
        return(
               <BarChart
                    title= {title}
                    data= {this.props.tableValues}
                    width= {width}
                    height= {height}
                    chartSeries = {chartSeries}
                    x= {x}
                    xLabel= {xLabel}
                    xScale= {xScale}
                    yTicks= {yTicks}
                    yLabel = {yLabel}
                    />
        )
    }
}

export default GraphView;