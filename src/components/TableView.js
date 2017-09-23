import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {blue500, red500, green500} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import UpIcon from 'material-ui/svg-icons/action/trending-up';
import DownIcon from 'material-ui/svg-icons/action/trending-down';

class TableView extends Component{
    constructor(props){ 
        super(props);
    }
    
    getPriceChangeicon(change){
      return change>0 ? <UpIcon color={green500}/> : change<0 ? <DownIcon color={red500}/> : "";
    }

    render(){
        return(
              <Table style={{'padding' : '25px','margin':'10px'}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Ticker</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>Last updated</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.tableValues.map((stock) => {
                if(this.props.filter === "All" || (this.props.filter === "Increasing" && stock.priceChange>0) || (this.props.filter === "Decreasing" && stock.priceChange<0))
               {
                return (
                  <TableRow >
                    <TableRowColumn>{stock.ticker}</TableRowColumn>
                    <TableRowColumn>{stock.price} {this.getPriceChangeicon(stock.priceChange)}</TableRowColumn>
                    <TableRowColumn>{stock.displayTime}</TableRowColumn>
                  </TableRow>
                )
               }
              })}
            </TableBody>
        </Table>
        )
    }
}

export default TableView;