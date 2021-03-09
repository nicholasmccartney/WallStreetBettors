import React from 'react'
import './topbar.css'
import logo from './ez_trade_logo.png'
import avatar from './default_avatar.png'
import { Link } from "react-router-dom";
import {
  checkIfOpen,
  checkWhenOpenedToday,
  printAccountInfo,
} from "../../../src/api/api.js";

class Topbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  setFetchedData = (data) => {
    this.setState(data)
  }

  marketStatus = () => {
    if (this.state.is_open) {
      return "The market is open."
    } else {
      return `The market is closed and will open at ${this.state.next_open}.`
    }
  }

  componentDidMount() {
    checkIfOpen(this.setFetchedData)
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <div class="container">
            <Link to="/">
              <img src={logo} alt="logo" height="50" width="75"></img>
            </Link>
          <div class="links">
            <p class="link">Link One</p>
            <p class="link">Link Two</p>
            <p class="link">Link Three</p>
          </div>
          <Link class="account-link" to="/account">
            <img src={avatar} alt="avatar" height="45" width="45"></img>
            <p>Account</p>
          </Link>
        </div>
        <div class={this.state.is_open ? "marketStatus-open" : "marketStatus-closed"}>
          
          {this.marketStatus()}

        </div>
      </div>
    );
  }
}

export default Topbar;