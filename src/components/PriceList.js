import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import TableView from './TableView';
import GraphView from './GraphView';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';

// Style object for price list layout
let styles = {
  toggleStyle : {
    width : '12%',
    'margin-top': '25px',
     right: '42%',
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
    left: '38%'
  }
}

class PriceList extends Component{

    constructor(props){
      super(props);
      this.state = {
        tableValues : [],    // Stock prices from Server with timeStamp and Change in price values
        view : 'table',      // User chosen view
        filterMenu: false,   // Boolean to control Filter menu 
        filter:"All"         // Filter, which is Currently applied 
      };
    }
    /**
     * Method to get Time Stamp
     */
    getTimeStamp(){
      let nowDate = new Date();
      return (nowDate.getDate()<10 ? "0"+nowDate.getDate() : nowDate.getDate()) + "/" +nowDate.getMonth() + "/" + nowDate.getFullYear() + "-" + nowDate.getHours() +":" + nowDate.getMinutes()+":"+nowDate.getSeconds();
    }  
    /**
     * This method process incoming stock prices from server
     * @param  {} data (Data from server)
     */
    processStockPrices(data){
      let aoStockObj = [];
      let timeStamp = new Date().getMilliseconds();
      data = JSON.parse(data);
      data.forEach((elem) => {
        let tempObj = {};
        tempObj.ticker = elem[0];
        tempObj.price = elem[1];
        tempObj.timeStamp = timeStamp;
        tempObj.displayTime = this.getTimeStamp(timeStamp); 
        aoStockObj.push(tempObj);
      });
      this.compareWithPreviousState(aoStockObj);  //To integrate with previous state of values
    }
    /**
     * This method compares incoming stock prices with previous list of stock details
     * If the ticker is already present, find the change in price and update
     * Or Add as a new item to the list
     * and Change the state
     * @param  {} newStockPrices (Processed new list of stock details from server)
     */
    compareWithPreviousState(newStockPrices){ 
      let presentStocks = this.state.tableValues;
      newStockPrices.forEach((stock) => {
        let updatedStock = presentStocks.find((obj) => obj.ticker === stock.ticker);
        if(updatedStock){               // The ticker item is already present, then update
          updatedStock.priceChange = (updatedStock.price < stock.price) ? 1 : -1;
          updatedStock.price = stock.price;
          updatedStock.displayTime = "few seconds ago ( "+this.getTimeStamp(stock.timeStamp) + " )";
          updatedStock.timeStamp = stock.timeStamp;
      }else{                          // New item , so add to the list
          presentStocks.push(stock);
        }
      });
       this.setState({
        tableValues : presentStocks
      })
    }
    
    /** 
     * Control handler of view toggle
     * @param  {} e (Event)
     * @param  {} isGraphView (Boolean , true for graphView,
     *                                   false for tableView)
     */
    toggleView(e,isGraphView){
      let view= (isGraphView) ? "graph" : "table";
      this.setState({
        view:view
      })
    }
    /**
     * Control handle for filter menu
     * @param  {} event
     */
    handleFilter = (event) => {
      event.preventDefault();
      this.setState({
        filterMenu: true,
        anchorEl: event.currentTarget,
      });
    }
    /**
     * Closing of filter menu
     */
    handleRequestClose = () => {
    this.setState({
        filterMenu: false,
      });
    };
    /**
     * This method gets invoked when a filter is applied
     * @param  {} e
     * @param  {} filter {"All","Increasing","Decreasing"}
     * @param  {} index
     */
    applyFilter = (e,filter,index) => {
      let filterValue = filter.props.primaryText;
      this.setState({
        filter:filterValue
      })
      this.handleRequestClose();
    }
    /**
     * It gets invoked when the Pricelist component is mounted
     * Initiates websocket connection with Server
     * And on message, Transfers the data to relevant method.
     */
    componentDidMount(){
        this.ws = new WebSocket('ws://stocks.mnet.website')
        this.ws.onmessage = e => {this.processStockPrices(e.data)}
        this.ws.onerror = e => {}
        this.ws.onclose = e => {}
    }
    /**
     * This method gets invoked
     * When PriceList component is mentioned.
     * Renders the view and toggles
     */
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
              {this.state.view === "table" ?
              <TableView tableValues = {this.state.tableValues} filter={this.state.filter} /> 
            : <GraphView tableValues = {this.state.tableValues} filter={this.state.filter}/>}
          </div>
      )
    }
}

export default PriceList;
