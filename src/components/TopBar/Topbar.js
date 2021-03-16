import React from 'react'
import './topbar.css'
import logo from "../../assets/ez_trade_logo.png"
import avatar from "../../assets/default_avatar.png";
import { Link } from "react-router-dom";
import {
  checkIfOpen,
  checkWhenOpenedToday,
  printAccountInfo,
} from "../../api/api.js";
import Timer from "../Timer/Timer.js";
import AccountLink from "../AccountLink/AccountLink.js";

class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loggedIn: false,
      user: null
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

  getMarketStatus = () => {
    checkIfOpen(this.setFetchedData);
    //this.setFetchedData({
    //  is_open: false,
    //  next_open: new Date("2021-03-09T20:30:00-05:00"),
    //});
  }

  componentDidMount() {
    this.getMarketStatus()
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
              <Link to="/strategies">
                <p className="link">Link One</p>
              </Link>
              <p className="link">Link Two</p>
              <p className="link">Link Three</p>
            </div>
            <AccountLink user={this.state.user} />
          </div>
          <div
            className={
              this.state.is_open ? "marketStatus-open" : "marketStatus-closed"
            }
          >
            {this.marketStatus()}
            <Timer
              compareDate={
                this.state.is_open
                  ? this.state.next_close
                  : this.state.next_open
              }
              resetTimer={this.getMarketStatus}
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