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
import Timer from "../Timer/Timer.js";

class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  setFetchedData = (data) => {
    this.setState(data);
    this.setState({ loading: false });
  };

  marketStatus = () => {
    if (this.state.is_open) {
      return "Market Open";
    } else {
      return "Market Closed";
    }
  };

  componentDidMount() {
    checkIfOpen(this.setFetchedData);
  }

  render() {
    if (this.state.loading === false) {
      return (
        <div>
          <div className="container">
            <Link to="/">
              <img src={logo} alt="logo" height="50" width="75"></img>
            </Link>
            <div className="links">
              <p className="link">Link One</p>
              <p className="link">Link Two</p>
              <p className="link">Link Three</p>
            </div>
            <Link className="account-link" to="/account">
              <img src={avatar} alt="avatar" height="45" width="45"></img>
              <p>Account</p>
            </Link>
          </div>
          <div
            className={
              this.state.is_open ? "marketStatus-open" : "marketStatus-closed"
            }
          >
            {this.marketStatus()}
            <Timer
              compareDate={
                this.state.is_open ? this.state.next_close : this.state.next_open
              }
            />
          </div>
        </div>
      );
    } else {
      return (
        null
      )
    }
  }
}

export default Topbar;