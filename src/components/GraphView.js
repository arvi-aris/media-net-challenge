import React, { Component } from 'react';
var BarChart = require('react-d3-basic').BarChart;
//GraphView Component
//renders price details in a Bar chart
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
        if(this.props.filter === "Increasing"){
            chartSeries[0].color = "green";
        }
        if(this.props.filter === "Decreasing"){
            chartSeries[0].color = "red";
        }
        return(
               <BarChart
                    title= {title}
                    data= {this.props.tableValues.filter((stock) => {
                        return (this.props.filter === "All" || (this.props.filter === "Increasing" && stock.priceChange>0) || (this.props.filter === "Decreasing" && stock.priceChange<0)) ? true : false;
                    })}
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