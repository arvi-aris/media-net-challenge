import React, { Component } from 'react';
import Home from './components/Home';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
// Base :: App component
class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <Home />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
