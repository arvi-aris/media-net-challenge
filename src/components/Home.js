import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import PriceList from './PriceList';
let styles = {
    barStyle : {
        'background-color' : 'rgb(31, 119, 180)'
    }
}
class Home extends Component{
    render(){
        return(
            <div>
              <AppBar
                title="Media.net challenge"
                iconClassNameLeft="hide"
                style = {styles.barStyle}
            />
            <PriceList />
            </div>
        )
    }
}

export default Home;
