import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Homepage from './pages/Homepage/Homepage'
import './App.css';

import Topbar from './components/TopBar/Topbar.js'


function pageMap() {
    return "test"
  }

class App extends React.Component {

  state = {
    page: "homepage"
  }

  render() {

    return (
      <Router>
        <div className="App">
          <Topbar />
        </div>

        <Switch>
          <Route path='/'>
            <Homepage/>
          </Route>
        </Switch>
      </Router>
    );
  }

}

export default App;
