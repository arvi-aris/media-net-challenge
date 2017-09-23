import React, { Component } from 'react';
import lodash from 'lodash';
import Toggle from 'material-ui/Toggle';
import TableView from './TableView';
import GraphView from './GraphView';
import Popover from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

let styles = {
  toggleStyle : {
    width : '12%',
    'margin-top': '25px',
     right: '45%',
     display:'inline-block'
  },
   thumbSwitched: {
    backgroundColor: 'rgb(31, 119, 180)',
  },
  trackSwitched: {
    backgroundColor: 'rgb(31, 119, 180)',
  },
  filterStyle:{
    position: 'relative',
    left: '45%'
  }
}
class PriceList extends Component{

    constructor(props){
      super(props);
      this.state = {
        tableValues : [],
        view : 'table',
        filterMenu: false,
        filter:"All"
      };
    }

    getTimeStamp(){
      let nowDate = new Date();
      return (nowDate.getDate()<10 ? "0"+nowDate.getDate() : nowDate.getDate()) + "/" +nowDate.getMonth() + "/" + nowDate.getFullYear() + "-" + nowDate.getHours() +":" + nowDate.getMinutes()+":"+nowDate.getSeconds();
    }

    processStockPrices(data){
      let aoStockObj = [];
      let timeStamp = new Date().getMilliseconds();
      data = JSON.parse(data);
      data.forEach((elem) => {
        let tempObj = {};
        tempObj.ticker = elem[0];
        tempObj.price = elem[1];
        tempObj.timeStamp = timeStamp;
        tempObj.displayTime = this.getTimeStamp(timeStamp)
        aoStockObj.push(tempObj);
      });
      this.updateDuplicatedStocks(aoStockObj);
      this.compareWithPreviousState(aoStockObj)
    }

    
    updateDuplicatedStocks(newStockPrices){
      newStockPrices = lodash.uniqBy(newStockPrices,'ticker');
      return newStockPrices;
    }

    compareWithPreviousState(newStockPrices){ 
      let presentStocks = this.state.tableValues;
      newStockPrices.forEach((stock) => {
        let updatedStock = presentStocks.find((obj) => obj.ticker === stock.ticker);
        if(updatedStock){
          updatedStock.priceChange = (updatedStock.price < stock.price) ? 1 : -1;
          updatedStock.price = stock.price;
          updatedStock.displayTime = "few seconds ago ( "+this.getTimeStamp(stock.timeStamp) + " )";
          updatedStock.timeStamp = stock.timeStamp;
      }else{
          presentStocks.push(stock);
        }
      });
       this.setState({
        tableValues : presentStocks
      })
    }

    toggleView(e,isGraphView){
      let view= (isGraphView) ? "graph" : "table";
      this.setState({
        view:view
      })
    }

    handleFilter = (event) => {
      event.preventDefault();
      this.setState({
        filterMenu: true,
        anchorEl: event.currentTarget,
      });
    }

    handleRequestClose = () => {
    this.setState({
        filterMenu: false,
      });
    };

    applyFilter = (e,filter,index) => {
      let filterValue = filter.props.primaryText;
      this.setState({
        filter:filterValue
      })
      this.handleRequestClose();
    }
    
    componentDidMount(){
        this.ws = new WebSocket('ws://stocks.mnet.website')
        this.ws.onmessage = e => {this.processStockPrices(e.data)}
        this.ws.onerror = e => {}
        this.ws.onclose = e => {}
    }

    render(){
      return( 
          <div>
            <Toggle
              label="Toggle view"
              onToggle={this.toggleView.bind(this)}
              style = {styles.toggleStyle}
              thumbSwitchedStyle={styles.thumbSwitched}
              trackSwitchedStyle={styles.trackSwitched}
              title="Toggle views ( Table and Graph)"
            />
            {this.state.view === "table" ?
            ( <div> 
              <IconButton 
                onClick={this.handleFilter}
                tooltip="Filter table"
                style={styles.filterStyle}
              >
              <FilterIcon />
              </IconButton>
              <Popover
                open={this.state.filterMenu}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
              >
                <Menu onItemTouchTap={this.applyFilter}>
                  <MenuItem primaryText="All" />
                  <MenuItem primaryText="Increasing" />
                  <MenuItem primaryText="Decreasing" />
                </Menu>
              </Popover>
             <TableView tableValues = {this.state.tableValues} filter={this.state.filter} /> </div>)
            : <GraphView tableValues = {this.state.tableValues} />}
          </div>
      )
    }
}

export default PriceList;
